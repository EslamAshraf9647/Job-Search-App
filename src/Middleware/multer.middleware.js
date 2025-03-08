import multer from "multer";
import fs from "fs"


export const Multer= (destinationPath= "general",allowsExtensions=[]) => {
    const destinationFolder = `Assets/${destinationPath}`
    if(!fs.existsSync(destinationFolder)){
        fs.mkdirSync(destinationFolder,{recursive:true})
    }
    const storage = multer.diskStorage({
        destination: function(req, file, cb){
        cb(null, destinationFolder)
        },
        filename: function(req, file, cb){
            console.log(file); // before upload 
            const uniqueSuufix =Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuufix+'__')+file.originalname
            
        }
    })
    const fileFliter = (req,file,cb) => {
        if(allowsExtensions.includes(file.mimetype)){
            cb(null , true)
        }
        else{
            cb(new Error ('Invaild file name',false))
        }
    }

    const upload = multer({fileFliter ,storage})
    return upload 
}