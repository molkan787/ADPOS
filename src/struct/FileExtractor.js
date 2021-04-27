const app = remote.app;
const fs = req("fs");
const path = req("path");

class FileExtractor {

    static init(){
        this.app = app;
    }

    static fileExist(path){
        return new Promise((resolve, reject) => {
            try {
              fs.stat(path, (error, file) => {
                console.log(file)
                if (!error && file.isFile()) {
                  return resolve(true);
                }else if (error && error.code === 'ENOENT') {
                  return resolve(false);
                }else{
                  reject(error);
                }
              });
            } catch (err) {
              reject(err);
            }
          });
    }

    static extract(sourceInAsarArchive, destOutsideAsarArchive) {
        return new Promise((resolve, reject) => {
            fs.copyFile(path.join(app.getAppPath(), sourceInAsarArchive), destOutsideAsarArchive, (err) => {
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