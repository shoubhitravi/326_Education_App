import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://127.0.0.1:3001'
}));


app.post('/create_model', (req, res) => {
    console.log("reaches")

    const inputs = req.body;
    console.log("hyperparameters");
    console.log(inputs);

    let file_path = ''
    if (inputs['modelType'] === 'Linear Regression'){
        // file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/lin_reg.py'
        file_path = "/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/lin_reg.py"
    }
    else if (inputs['modelType'] === 'Decision Tree'){
        file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/decision.py'
    }
    else {
        file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/models/nn.py'
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
