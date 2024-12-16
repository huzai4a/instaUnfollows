const path = require('path');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const yauzl = require('yauzl');
const { pipeline } = require('stream');
const app = express();

// Middleware imports
const filesPayloadExists = require(path.join(__dirname, 'public', 'middleware', 'filesPayloadExists'));
const fileExtLimiter = require(path.join(__dirname, 'public', 'middleware', 'fileExtLimiter'));
const fileSizeLimit = require(path.join(__dirname, 'public', 'middleware', 'fileSizeLimit'));
const formatCheck = require(path.join(__dirname, 'public', 'middleware', 'formatCheck'));

// Paths
const dataPath = path.join(__dirname, 'data');
const extractedPath = path.join(dataPath, 'extracted');
const unextractedPath = path.join(dataPath, 'unextracted');

// Ensure directories exist
fs.mkdirSync(extractedPath, { recursive: true });
fs.mkdirSync(unextractedPath, { recursive: true });

// Example ZIP name
let zipName;
// let zipName = 'instagram-huzai4a-2024-08-17-T90Ye0vc.zip';

// Route for file upload
app.post(
  '/api/uploadZip/instagram',
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.zip', '.rar', '.7zip']),
  fileSizeLimit,
  formatCheck,
  (req, res) => {
    const zip = req.files;

    // Save uploaded ZIP file
    const uploadedFile = zip[Object.keys(zip)[0]];
    zipName = uploadedFile.name;
    const zipPath = path.join(unextractedPath, zipName);

    uploadedFile.mv(zipPath, (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err });
        }
    
        // Call extractZip after upload
        extractZip();
    
        res.status(200).json({ status: 'success', message: 'File uploaded' });
    });
    
  }
);

// Extract ZIP function
function extractZip() {
    const zipPath = path.join(unextractedPath, zipName);

    yauzl.open(zipPath, { lazyEntries: true }, (err, zipFile) => {
        if (err) {
            console.error(`Error opening ZIP: ${err}`);
            return;
        }

        zipFile.readEntry();

        zipFile.on('entry', (entry) => {
            const destPath = path.join(extractedPath, entry.fileName);

            if (/\/$/.test(entry.fileName)) {
                // Directory entry
                fs.mkdirSync(destPath, { recursive: true });
                zipFile.readEntry();
            } else {
                // File entry
                zipFile.openReadStream(entry, (err, readStream) => {
                    if (err) {
                        console.error(`Error reading entry stream: ${err}`);
                        return;
                    }

                    // Ensure parent directory exists
                    fs.mkdirSync(path.dirname(destPath), { recursive: true });

                    // Stream file contents to disk
                    const writeStream = fs.createWriteStream(destPath);
                    pipeline(readStream, writeStream, (err) => {
                        if (err) {
                            console.error(`Error writing file: ${err}`);
                        } else {
                            console.log(`Extracted: ${destPath}`);
                        }
                    });

                    readStream.on('end', () => zipFile.readEntry());
                });
            }
        });

        zipFile.on('end', () => {
            console.log('### ZIP extraction complete.');
        });

        zipFile.on('error', (err) => {
            console.error(`Error during extraction: ${err}`);
        });
    });
}


// API routes
app.get('/api/following-fetch', (req, res) => {
  const userHandle = 'huzai4a';
  const selectedFile = fs.readdirSync(extractedPath).find((file) => file.includes(userHandle));

  if (selectedFile) {
    const filePath = path.join(extractedPath, selectedFile, 'connections', 'followers_and_following', 'following.json');
    const followingObjects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.status(200).json({
      status: 'success',
      message: 'sent',
      data: followingObjects,
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'No matching file found',
    });
  }
});

app.get('/api/followers-fetch', (req, res) => {
  const userHandle = 'huzai4a';
  const selectedFile = fs.readdirSync(extractedPath).find((file) => file.includes(userHandle));

  if (selectedFile) {
    const filePath = path.join(extractedPath, selectedFile, 'connections', 'followers_and_following', 'followers_1.json');
    const followersObjects = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.status(200).json({
      status: 'success',
      message: 'sent',
      data: followersObjects,
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'No matching file found',
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main HTML route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'listChecker.html'));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught exception: ${err}`);
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
