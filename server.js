const path = require('path');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
// const yauzl = require('yauzl');
const app = express();

// NOTE: HAVING THE ABOVE NEXT IN THE FOR LOOP CAUSES IT TO PEND FOREVER (GENERALLY FOR ALL MIDDLEWARE)
const filesPayloadExists = require(path.join(__dirname, 'public', 'middleware', 'filesPayloadExists'));
const fileSizeLimit = require(path.join(__dirname, 'public', 'middleware', 'fileSizeLimit'));
const fileExtLimiter = require(path.join(__dirname, 'public', 'middleware', 'fileExtLimiter'));


// used in both following and follower fetches
const dataPath = path.join(__dirname,'data', 'extracted');
// eventually i want the userhandle to be user selection (this is the initial step before making the submit form work)
const userHandle = 'huzai4a';
// NOTE: find can be used instead of forEach with if
const selectedFile = fs.readdirSync(dataPath).find(file => file.includes(userHandle));

//route for listchecker following fetch
app.get('/api/following-fetch', (req, res) => {
    const followingObjects = JSON.parse(fs.readFileSync(path.join(dataPath, selectedFile, 'connections', 'followers_and_following', 'following.json'), 'utf8'));
    res.json(followingObjects); //send the followingObjects as JSON to the client
});
//route for listchecker followers fetch
app.get('/api/followers-fetch', (req, res) => {
    const followersObjects = JSON.parse(fs.readFileSync(path.join(dataPath, selectedFile, 'connections', 'followers_and_following', 'followers_1.json'), 'utf8'));
    res.json(followersObjects); //send the followingObjects as JSON to the client
});

// route for submitted files
app.post('/api/uploadZip/instagram', 
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.zip','.rar','.7zip']), 
    fileSizeLimit,
    (req, res) => {
    const zip = req.files;
    // console.log(zip);
    
    return res.status(200).json({ status: 'logged', message: 'logged'});
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

//route for main html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'listChecker.html'));
})

// fetch('https://www.instagram.com/huzai4a').then(response=>console.log(response.html()))

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