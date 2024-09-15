function fileExtLimiter (allowedExtArray){

    return (req,res,next)=>{
        const file = req.files;
        const fileExtensions = [];
        
        // although this project only allows one upload, this makes the code transferable
        /*
        Object.keys(file).forEach(key=>{
            fileExtensions.push(path.extname(file(key).name));
        })
        */

        // require path wasn't working, this is my workaround to geth the ext of the user file    
        const fileName = file[Object.keys(file)].name;
        const fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
        
        fileExtensions.push(fileType);
        
        fileExtensions.every(userExt =>{
            const allowedExt = allowedExtArray.includes(userExt);
            if (!allowedExt){
                // 422 is unprocessable entity
                return res.status(422).json({status:'error',message:`File type '${userExt}' not supported. Only ${allowedExtArray.toString().replaceAll(',', ', ')} allowed`});
            } else{ 
                next();
            }
        })
    
    }
}

module.exports = fileExtLimiter;