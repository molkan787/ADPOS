import DataExporter from '../DataExporter';
import Utils from '../../utils';
import store from '../../store';
const gmailSend = req('gmail-send');

const NAME_DAILY = 'dailySalesMail';
const NAME_WEEKLY = 'weeklySalesMail';

const CHECK_INTERVAL = 1000 * 60;

class ReportsMailer {

    static init(CronTasks){
        this.CronTasks = CronTasks;
    }

    static start(){
        setInterval(() => this.checkEligibility(), CHECK_INTERVAL);
        this.checkEligibility();
        console.log('Started cron task "ReportsMailer".')
    }

    static async checkEligibility(){
        if(!this.isConfigValid()) return;
        const d = new Date();
        const hour = d.getHours();
        const day = d.getDay();
        if(!this.CronTasks.isDoneToday(NAME_DAILY) && hour >= 20 && (day >= 1 && day <= 5)){
            try {
                await this.doDaily();
                this.CronTasks.markAsDoneToday(NAME_DAILY);
                console.log('Sent daily sales report.');
            } catch (error) { console.error(error) }
        }
        if(!this.CronTasks.isDoneToday(NAME_WEEKLY) && hour >= 20 && day == 5){
            try {
                await this.doWeekly();
                this.CronTasks.markAsDoneToday(NAME_WEEKLY);
                console.log('Sent weekly sales report.');
            } catch (error) { console.error(error) }
        }
    }

    static isConfigValid(){
        const setting = store.state.setting;
        return setting.gmailUser && setting.gmailPass && setting.mailSendTo && true;
    }

    // ------------------------------------------------------
    static async doDaily() {
        const date = Utils.getDateString();
        const file = await DataExporter.exportDailySales(date);
        return await this.sendMail(file, date, 'Daily');
    }

    // ------------------------------------------------------

    static async doWeekly() {
        const d = new Date();
        const to = Utils.getDateString(d);
        d.setDate(d.getDate() - 4);
        const from = Utils.getDateString(d);

        const file = await DataExporter.exportDateRangeSales(from, to);
        return await this.sendMail(file, `${from} - ${to}`, 'Weekly');
    }

    // ------------------------------------------------------
    static sendMail(filename, date, name) {
        return new Promise((resolve, reject) => {
            const setting = store.state.setting;
            const send = gmailSend({
                user: setting.gmailUser,
                pass: setting.gmailPass,
                to: setting.mailSendTo,
                subject: `Avanti ${name} Sales Reports - ${date}`,
            });
            send({
                cc: setting.mailCC || undefined,
                html: `
                    <h4>Avanti ${name} sales report</h4>
                    <h4>Sales date: ${date}</h4>
                `,
                files: [filename]
            }, (error, result, fullResult) => {
                if (error) reject(error);
                else resolve(result);
            })
        })
    }

}

window.ReportsMailer = ReportsMailer;
export default ReportsMailer;