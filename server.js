const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();



// used in both following and follower fetches
const dataPath = path.join(__dirname,'data');
// eventually i want the userhandle to be user selection (this is the initial step before making the submit form work)
const userHandle = 'huzai4a';
// NOTE: find can be used instead of forEach with if
const selectedFile = fs.readdirSync(dataPath).find(file => file.includes(userHandle));

//route for listchecker following fetch
app.get('/following-fetch', (req, res) => {
    const followingObjects = JSON.parse(fs.readFileSync(path.join(dataPath, selectedFile, 'connections', 'followers_and_following', 'following.json'), 'utf8'));
    res.json(followingObjects); //send the followingObjects as JSON to the client
});
//route for listchecker followers fetch
app.get('/followers-fetch', (req, res) => {
    const followersObjects = JSON.parse(fs.readFileSync(path.join(dataPath, selectedFile, 'connections', 'followers_and_following', 'followers_1.json'), 'utf8'));
    res.json(followersObjects); //send the followingObjects as JSON to the client
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

//route for main html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'listChecker.html'));
})

// works to stop code on uncaught errors
process.on('uncaughtException', err =>{
    console.log(`uncaught error, ${err}`)
    process.exit(1);
})

// server starting
const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})