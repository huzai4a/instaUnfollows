function formatCheck (req, res, next){
    const file = req.files;
    const name = file[Object.keys(file)].name;
    // note: substring is non inclusive of the last char
    const ig = name.substring(0, name.indexOf('-'));

    if (ig === 'instagram'){
        next();
    } else{
        return res.status(400).json({status: 'error', message: 'Invalid name formatting, must be default to proceed <br>(i.e. instagram-username-2022-08-17-T90Ye0vc.zip)'});
    }
}

module.exports = formatCheck;