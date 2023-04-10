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
const {spawn} = require('child_process'); // for python script
const fs = require('fs');


app.use(cors());
app.use(express.text());

const fileUpload = require('express-fileupload');
var validProcessedList = [];

app.use(fileUpload({
    createParentPath: true
}));

app.listen(PORT, function(err) {
    getFiles();
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is running on port ${PORT}`);
    }
});

app.post('/upload',  function (req, res) {

    var textReceivedObj = req.files.text;   //text file containing external data collected from sensors
    var imageReceivedObj = req.files.image; //image file outputted from slam algorithm mapping process
    var yamlReceivedObj = req.files.yaml;   //yaml file containing parameters for slam algorithm


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

    fs.writeFile("./inputData/" + yamlReceivedObj.name, yamlReceivedObj.data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The yaml file was saved!");
    }); 

    // spawn new child process to call the python script
    initPostProcess(textReceivedObj.name.slice(0, -4));

    setMostRecent(textReceivedObj.name.slice(0, -4)); // saves the most recent file name to text file for later use

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

app.get('/recentName', (req, res) => {  // get the most recent file name

    // var options = {
    //     root: path.join(__dirname + '/output/'),
    // };

    res.send( getMostRecent());
    res.sendStatus(201);
});

app.get('/1d_0/mostRecent', (req, res) => {  // get the most recent file name

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    var fileName = '1d_0_' + getMostRecent() +'.txt';
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

app.get('/1d_1/mostRecent', (req, res) => {  // get the most recent file name

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    var fileName = '1d_1_' + getMostRecent() +'.txt';
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

app.get('/2d/mostRecent', (req, res) => {  // get the most recent file name

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    var fileName = '2d_' + getMostRecent() +'.txt';
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

app.get('/yaml/mostRecent', (req, res) => {  // get the most recent file name

    var options = {
        root: path.join(__dirname + '/inputData/'),
    };

    var fileName = getMostRecent() +'.yaml';
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

app.get('/validProcessedList', (req, res) => {  // get the most recent file name
    res.send(validProcessedList);
});

// app.get('/2d/specfic', (req, res) => {  // get specific processed 2d file
//     console.log(req.query);

//     var options = {
//         root: path.join(__dirname + '/processedData/'),
//     };

//     res.sendFile("2d_" + req.query.fileName + '.txt', options, (err) => {
//         if (err) {
//             console.log(err);
//             res.status(err.status).end();
//         }
//         else {
//             console.log('Sent:', req.query.fileName);
//         }
//     });
// });

app.get('/2d/specific', (req, res) => {  // get specific processed 2d file
    console.log(req.query);

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    res.sendFile("2d_" + req.query.fileName + '.txt', options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.query.fileName);
        }
    });
});
    // 1d_0/specific
    // 1d_1/specific
    // yaml/specific

app.get('/1d_0/specific', (req, res) => {  // get specific processed 2d file
    console.log(req.query);

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    res.sendFile("1d_0_" + req.query.fileName + '.txt', options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.query.fileName);
        }
    });
});

app.get('/1d_1/specific', (req, res) => {  // get specific processed 2d file
    console.log(req.query);

    var options = {
        root: path.join(__dirname + '/processedData/'),
    };

    res.sendFile("1d_1_" + req.query.fileName + '.txt', options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.query.fileName);
        }
    });
});

app.get('/yaml/specific', (req, res) => {  // get specific processed 2d file
    console.log(req.query);

    var options = {
        root: path.join(__dirname + '/inputData/'),
    };

    res.sendFile(req.query.fileName + '.yaml', options, (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.query.fileName);
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

// function queryMostRecentData(){
//     var files = fs.readdirSync('./processedData/');
//     console.log(files);
//     for (var i = 0; i < files.length; i++) {
//         // console.log(files[i]);
//         files[i] = files[i].slice(3); // remove the "2d_" or "1d_" prefix
//     }
//     console.log(files);

//     var string = files[0].slice(0,10);
//     console.log(string);
//     var date = new Date(string);
//     console.log(date);
// }

function getMostRecent(){
    try {  
        var data = fs.readFileSync('recentName.txt', 'utf8');
        console.log(data.toString());    
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function setMostRecent(fileName){
    try {  
        fs.writeFileSync('recentName.txt', fileName, 'utf8');
        console.log("updated recentName.txt");
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function getFiles(){
    // var files = fs.readdirSync('./inputData/');
    var processedDirName = './processedData/';
    var inputDirName = './inputData';

    var processedFileObjs = fs.readdirSync(processedDirName);
    var inputFileObjs = fs.readdirSync(inputDirName);

    // console.log(files);
    // return files;
    console.log(processedFileObjs.length);
    console.log(inputFileObjs.length);

    //create 3 arrays
    var list1d0 = [];
    var list1d1 = [];
    var list2d = [];
    let listYaml = [];
    var count1dDep = 0;

    processedFileObjs.forEach(file => {
        let slice = file.slice(0,4);
        // console.log(slice);

        switch (slice) {
            case '1d_0':
                list1d0.push(file);
                break;
            case '1d_1':
                list1d1.push(file);
                break;
            case '2d_2':
                list2d.push(file);
                break;
            default:
                // 1d_2 do nothing (deprecated)
                count1dDep++;
                break;
        }
        
      });


      //check for valid yaml files in inputData since not processed
      
      inputFileObjs.forEach(file => {
        let fileType = file.slice( file.length-4 ,file.length);

        if(fileType !== 'yaml') return;

        let slice = file.slice(0, file.length - 5);

        listYaml.push(slice); //41
      });




    //   console.log(list1d0.length);
    //   console.log(list1d1.length);
    //   console.log(list2d.length);
    //   console.log(count1dDep);



    //check valid 1d_0, 1d_1 and yaml file for each 2d_ file
    var valid1d_0 = false;
    var valid1d_1 = false;
    var validYaml = false;

    list2d.forEach(element2d => {
        fileName2d = element2d.slice(3, element2d.length - 4);

        //console.log(fileName);
        // console.log()
  
        list1d0.forEach(element1d0 => {
            fileName1d0 = element1d0.slice(5, element1d0.length - 4);
            if(fileName1d0 == fileName2d) valid1d_0 = true;
        });

        list1d1.forEach(element1d1 => {
            fileName1d1 = element1d1.slice(5, element1d1.length - 4);
            if(fileName1d1 == fileName2d) valid1d_1 = true;
        });

        listYaml.forEach(elementYaml => {
            if(elementYaml == fileName2d) validYaml = true;
        });

        if(!valid1d_0){
            console.error('no valid 1d_0 file found in processed data');
            return;
        }
    
        if(!valid1d_1){
            console.error('no valid 1d_1 file found in processed data');
            return;
        }
    
        if(!validYaml){
            console.error('no valid yaml file found in processed data');
            return;
        }

        validProcessedList.push(fileName2d);
        
    });

    console.log('validProcessedList: ' + validProcessedList.length);




    // console.log(processedFileObjs[0]);

 }
