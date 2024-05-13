
import { spawn } from 'child_process';
import path from 'path';
import express from 'express';
import PouchDB from 'pouchdb';

const db = new PouchDB('my_db');

const app = express();
const port = 3000;

app.use(express.json());

const clientPath = path.resolve('../client');
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});



app.post('/create_model', (req, res) => {
    console.log("reaches")

    const inputs = req.body;
    console.log("hyperparameters");
    console.log(inputs);

    let file_path = ''
    if (inputs['modelType'] === 'Linear Regression'){
        file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/lin_reg.py'
        // file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/models/lin_reg.py"
    }
    else if (inputs['modelType'] === 'Decision Tree'){
        file_path = "/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/decision.py"
        // file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/models/decision.py"
    }
    else {
        file_path = "/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/nn.py"
        // file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/models/nn.py"
    }


    const pythonProcess = spawn('/usr/local/bin/python3', [file_path, JSON.stringify(inputs)], {
        maxBuffer: 10 * 1024 * 1024 * 1024
    });
    

    let responseData = '';
    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        res.send(responseData);
    });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
