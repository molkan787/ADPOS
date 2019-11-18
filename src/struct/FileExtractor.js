const app = req('electron').remote.app;
const fs = req("fs");

class FileExtractor {

    static init(){
        this.app = app;
    }

    static fileExist(path){
        return new Promise((resolve, reject) => {
            try {
              fs.stat(path, (error, file) => {
                if (!error && file.isFile()) {
                  return resolve(true);
                }
        
                if (error && error.code === 'ENOENT') {
                  return resolve(false);
                }
              });
            } catch (err) {
              reject(err);
            }
          });
    }

    static extract(sourceInAsarArchive, destOutsideAsarArchive) {
        return new Promise((resolve, reject) => {
            fs.copyFile(app.getAppPath() + "/" + sourceInAsarArchive, destOutsideAsarArchive, (err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        })
    }

}
FileExtractor.init();
export default FileExtractor;