//import libraries and initialise global variables
const express = require('express');
const app = express();
const path = require('path');
const PORT = 6968;
const cors = require('cors');
var router = express.Router();
const {spawn} = require('child_process'); // for python script
const fs = require('fs');

/**
 * Server initialisation
 */
app.use(cors());    // enable Cross-Origin-Resource-Sharing
app.use(express.text());

const fileUpload = require('express-fileupload');
var validProcessedList = [];

app.use(fileUpload({
    createParentPath: true
}));

app.listen(PORT, function(err) {    //listen on port 6968
    getFiles(); // gets list of valid processed maps and saves to validProcessedList[]
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is running on port ${PORT}`);
    }
});

app.post('/upload',  function (req, res) {  //  POST method for uploading captured data from Raspberry pi via ROS.

    var textReceivedObj = req.files.text;   //text file containing external data collected from sensors
    var imageReceivedObj = req.files.image; //image file outputted from slam algorithm mapping process
    var yamlReceivedObj = req.files.yaml;   //yaml file containing config parameters for slam algorithm and 2d map


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


app.get('/recentName', (req, res) => {  // get the most recent file name

    res.send( getMostRecent());
    res.sendStatus(201);
});

/**
 * Following function returns most recent specific file by specifying file type.
 */

app.get('/1d_0/mostRecent', (req, res) => { // get the most recent top 1d lidar vertices

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

app.get('/1d_1/mostRecent', (req, res) => {  // get the most recent bottom 1d lidar vertices

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

app.get('/2d/mostRecent', (req, res) => {  // get the most recent processed 2d lidar vertices

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

app.get('/yaml/mostRecent', (req, res) => {  // get the most recent yaml file, contains config info for 2d map vertices

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

/**
 * Returns list of all valid processed maps
 */
app.get('/validProcessedList', (req, res) => {  // get the most recent file name
    res.send(validProcessedList);
});

/**
 * Following function returns specific file by specififying name as a parameter.
 */
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

app.get('/1d_0/specific', (req, res) => {  // get specific top 1d lidar vertices
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

app.get('/1d_1/specific', (req, res) => {  // get specific bottom 1d lidar vertices
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

app.get('/yaml/specific', (req, res) => {  // get specific yaml file, contains config info for 2d map vertices
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


/**
 * Post Processing functions:
 */

function initPostProcess(fileName) {    // spawns python script as child process to carry out post-processing
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
    });
}

function getMostRecent(){ //gets most recently processed file from recentName.txt (quick hacky solution)
    try {  
        var data = fs.readFileSync('recentName.txt', 'utf8');
        console.log(data.toString());    
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function setMostRecent(fileName){ //sets most recently processed file in recentName.txt (quick hacky solution to avoid having to check most recent in dir each time server is restarted)
    try {  
        fs.writeFileSync('recentName.txt', fileName, 'utf8');
        console.log("updated recentName.txt");
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function getFiles(){ // gets list of valid processed maps that is returned in the GET method ('/validProcessedList')

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

    //check valid 1d_0, 1d_1 and yaml file for each 2d_ file
    var valid1d_0 = false;
    var valid1d_1 = false;
    var validYaml = false;

    list2d.forEach(element2d => {
        fileName2d = element2d.slice(3, element2d.length - 4);

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
            console.error('no valid yaml file found in input data');
            return;
        }

        validProcessedList.push(fileName2d);
        
    });

    console.log('validProcessedList: ' + validProcessedList.length);

 }
