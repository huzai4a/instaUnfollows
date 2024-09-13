function fileSizeLimit (req, res, next){
    const MB = 5;
    const FILE_SIZE_LIMIT = MB*1024*1024;
    
    const files = req.files;
    const filesOverLimit = [];
    console.log(files[Object.keys(files)].size);
    if (files[Object.keys(files)].size > FILE_SIZE_LIMIT){
        filesOverLimit.push(files[Object.keys(files)].name);
    }

    if (filesOverLimit.length){
        return res.status(413).json({ status:'error', message:`File over limit of 5MB: '${filesOverLimit[0]}' (${files[Object.keys(files)].size/1024/1024} MB)`});
    }
    
    next();
}

module.exports = fileSizeLimit;