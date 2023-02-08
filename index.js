// const fs = require('fs');
// const axios = require('axios');
// const FormData = require('form-data');
// var os = require('os');


const express = require('express');
const app = express();
const path = require('path');
const PORT = 6968;
const cors = require('cors');
var router = express.Router();
const {spawn} = require('child_process'); // for python

const fs = require('fs');
// const multer = require('multer');
// const upload = multer({dest:'uploads/'}); //.single("demo_image");

app.use(cors());
app.use(express.text());

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true
}));

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is running on port ${PORT}`);
    }
});
app.post('/upload',  function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 

    // console.log(req.files);
    // var received = req.files.nameHolder; // the uploaded file object
    // console.log(received);
    var textReceivedObj = req.files.text;
    var imageReceivedObj = req.files.image;


    // var buffer = received.data;     // the uploaded file data
    // var fileName = received.name;   // the uploaded file name
    // console.log(buffer.toString('utf8'));


    fs.writeFile("./inputData/" + textReceivedObj.name, textReceivedObj.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The text file was saved!");
    }); 

    fs.writeFile("./inputData/" + imageReceivedObj.name, imageReceivedObj.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The image file was saved!");
    }); 

    // spawn new child process to call the python script
    initPostProcess(textReceivedObj.name.slice(0, -4));

    res.sendStatus(201);
 });
// app.post('/upload', fileUpload, (req, res) => {
//   //Now you can use req.files.file to access the file input with name="file"
//   var object = {data: req.files.file.data, contentType: req.files.file.mimetype};
//   console.log(object);
//   //Now perform user.save
//   res.sendStatus(201);
// })


// app.post('/upload', function(req, res) {
//     var received = req.files.nameHolder; // the uploaded file object
//     console.log(received);
//     var buffer = received.data;
//     console.log(buffer.toString('utf8'));

//     // spawn new child process to call the python script
//     const python = spawn('python', ['scripts/print.py']);
//     // collect data from script
//     python.stdout.on('data', function (data) {
//         console.log('Pipe data from python script ...');
//         dataToSend = data.toString();
//         console.log(dataToSend);
//     });
//     python.on('close', (code) => {
//         console.log(`child process close all stdio with code ${code}`);
//         // send data to browser
//         //res.send(dataToSend)
//     });

//     res.sendStatus(201);
//   });



// const multer  = require('multer');
// const upload = multer({ dest: os.tmpdir() });

// router.post('/upload', upload.single('file'), function(req, res) {
//     const title = req.body.title;
//     const file = req.file;
  
//     console.log(title);
//     console.log(file);
  
//     res.sendStatus(200);
//   });
  
// module.exports = router;

// app.post('/upload', upload.single('file'), function(req, res) {
//     const title = req.body.title;
//     const file = req.file;
  
//     console.log(title);
//     console.log(file);
  
//     res.sendStatus(200);
//   });

  
app.post('/post', (req, res) => {
    //const { email, firstName } = req.body
    // console.log(req);
    // console.log(req.head);

    //console.log(req.body);
    var received = req.body;
    console.log(received.data);
    // const user = new User({ email, firstName })
    // const ret = await user.save()
    // res.json(ret)
    res.sendStatus(201);
});

app.post('/loadfile', (req, res) => {

    console.log("react to post action - loadFile");
    res.send("submit ok");
    // Notice the addition of the "fileName" key
    // It is the HTML name attribute value here in the input element:
    // <td><input type="file" name="fileName"></td>
    var logFile = req.files.fileName;
  
    console.log(logFile);
    var buffer = logFile.data;
    console.log(buffer.toString('utf8'));
  
  });


app.get('/2d', (req, res) => {
    // res.status(200).send('Hello World');

    // var text = 'Hello World';
    // res.attachment('textFiles/knownSpacePoints.txt');
    // res.type('txt');
    // res.status(200).send(text);

    var options = {
        root: path.join(__dirname + '/textFiles/'),
    };

    var fileName = 'knownSpacePoints.txt';
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

});

// app.get('/vert', (req, res) => {

//     var options = {
//         root: path.join(__dirname + '/textFiles/'),
//     };

//     var fileName = 'vertPoints_2.txt';
//     res.sendFile(fileName, options, (err) => {
//         if (err) {
//             console.log(err);
//             res.status(err.status).end();
//         }
//         else {
//             console.log('Sent:', fileName);
//         }
//     });

// });


app.get('/output/2d', (req, res) => {
    // res.status(200).send('Hello World');

    // var text = 'Hello World';
    // res.attachment('textFiles/knownSpacePoints.txt');
    // res.type('txt');
    // res.status(200).send(text);

    var options = {
        // root: path.join(__dirname + '/textFiles/'),
        root: path.join(__dirname + '/output/'),
    };

    var fileName = '2d_Points.txt';
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

});

app.get('/output/1d', (req, res) => {

    var options = {
        root: path.join(__dirname + '/output/'),
    };

    var fileName = '1d_Points.txt';
    res.sendFile(fileName, options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

});


function initPostProcess(fileName) {
    // spawn new child process to call the python script
    const python = spawn('python3', ['scripts/main.py', fileName]);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend);
    });
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        //res.send(dataToSend)
    });
}
