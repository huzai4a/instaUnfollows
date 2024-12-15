const path = require('path');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const yauzl = require('yauzl');
const app = express();

// NOTE: HAVING THE ABOVE NEXT IN THE FOR LOOP CAUSES IT TO PEND FOREVER (GENERALLY FOR ALL MIDDLEWARE)
const filesPayloadExists = require(path.join(__dirname, 'public', 'middleware', 'filesPayloadExists'));
const fileSizeLimit = require(path.join(__dirname, 'public', 'middleware', 'fileSizeLimit'));
const fileExtLimiter = require(path.join(__dirname, 'public', 'middleware', 'fileExtLimiter'));
const formatCheck = require(path.join(__dirname, 'public', 'middleware', 'formatCheck'));


// used in both saving and accessing data files
const dataPath = path.join(__dirname, 'data');
let zipName = 'instagram-huzai4a-2024-08-17-T90Ye0vc.zip';

// route for submitted files
app.post('/api/uploadZip/instagram', 
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.zip','.rar','.7zip']), 
    fileSizeLimit,
    formatCheck,
    (req, res) => {
    const zip = req.files;
    // zipName = zip[Object.keys(zip)].name;
    /*
    zip[Object.keys(zip)].mv(path.join(dataPath, 'unextracted'), (err) =>{
        if(err) return res.status(500).json({ status: 'error', message: err})
    });
    */

    // change message to name of zip extracted when done
    return res.status(200).json({ status: 'success', message: 'logged'});
});

extractZip();

// eventually i want the userhandle to be user selection (this is the initial step before making the submit form work)
const userHandle = 'huzai4a';
// NOTE: find can be used instead of forEach with if
const selectedFile = fs.readdirSync(path.join(dataPath, 'extracted')).find(file => file.includes(userHandle));
// console.log(selectedFile);

//route for listchecker following fetch
app.get('/api/following-fetch', (req, res) => {
    if (selectedFile){
        const followingObjects = JSON.parse(fs.readFileSync(path.join(dataPath, 'extracted', selectedFile, 'connections', 'followers_and_following', 'following.json'), 'utf8'));
        return res.status(200).json({
            status:'success',
            message:'sent',
            data: followingObjects
        }); //send the followingObjects as JSON to listchecker
    } else{
        return res.status(400).json({
            status:'error',
            message:'there was an issue with the submitted file'
        })
    }
});
//route for listchecker followers fetch
app.get('/api/followers-fetch', (req, res) => {
    if (selectedFile){
        const followersObjects = JSON.parse(fs.readFileSync(path.join(dataPath, 'extracted', selectedFile, 'connections', 'followers_and_following', 'followers_1.json'), 'utf8'));
        return res.status(200).json({
            status:'success',
            message:'sent',
            data: followersObjects
        }); //send the followingObjects as JSON to listchecker
    } else{
        return res.status(400).json({
            status:'error',
            message:'there was an issue with the submitted file'
        })
    }
    
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

//route for main html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'listChecker.html'));
})

// fix this
function extractZip() {
    // extract file
    yauzl.open(path.join(dataPath, 'unextracted', zipName), {lazyEntries: true}, (err, zipFile)=>{
        if (err) throw err;
        zipFile.readEntry();
        zipFile.on("entry", function(entry) {
            if (/\/$/.test(entry.fileName)) {
                // Directory file names end with '/'.
                // Note that entries for directories themselves are optional.
                // An entry's fileName implicitly requires its parent directories to exist.
                zipFile.readEntry();
            } else {
                // file entry
                zipFile.openReadStream(entry, function(err, readStream) {
                    if (err) throw err;
                    readStream.on("end", function() {
                        zipFile.readEntry();
                    });
                    
                    const { finished } = require('stream');

                    const destDir = 'C:\\Users\\huzai\\.vscode\\Projects\\JS\\listChecker\\data\\extracted';
                    const writer = fs.createWriteStream(path.join(destDir, entry.fileName));

                    readStream.pipe(writer);

                    finished(readStream, (err) => {
                        if (err) {
                            console.error('### Streaming to writer failed: ', err);
                        } else {
                            console.log('### Streaming to writer succeeded, file unzipped.');
                        }
                    });
                });
            }
        });
    });
}


// works to stop code on uncaught errors
process.on('uncaughtException', err =>{
    // create a page that you get pushed to when theres an error, or replace all the html on the page rn with an error message
    console.log(`uncaught error, ${err}`);
    process.exit(1);
})

// server starting
const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});