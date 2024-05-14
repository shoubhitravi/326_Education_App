
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

app.put('/store_inputs', (req, res) => {
    console.log("store inputs");
    const inputs = req.body;
    db.put(inputs)
        .then(() => {
            res.status(200).send('Data stored successfully');
        })
        .catch(err => {
            console.error('Error storing data:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/all_docs', (req, res) => {
    db.allDocs({ include_docs: true })
        .then(result => {
            const docs = result.rows.map(row => row.doc);
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(error => {
            console.error('Error retrieving documents from the database:', error);
            res.status(500).send('Internal Server Error');
        });
});



app.post('/create_model', (req, res) => {
    console.log("create model");

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

app.put('/update_comments', async (req, res) => {
    console.log("Update comments");
    const { id, comments } = req.body;

    if (!id || !comments) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Fetch the document from the database
        const doc = await db.get(id);

        // Update the comments field
        doc.comments = comments;

        // Save the updated document back to the database
        await db.put(doc);

        res.status(200).send('Comments updated successfully');
    } catch (error) {
        if (error.status === 404) {
            res.status(404).json({ message: 'Item with specified ID not found.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
});


app.delete('/delete_entry', async (req, res) => {
    console.log("1");
    const { _id } = req.body;
    console.log("delete entry");
    console.log(_id);
    try {
        // Fetch the document from the database to get the _rev
        console.log("working.");
        const doc = await db.get(_id);

        console.log("doc", doc);
        // Delete the document from the database
        db.remove(doc._id, doc._rev);

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        if (error.status === 404) {
            res.status(404).json({ message: 'Item with specified ID not found.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


function clearDatabase() {
    db.allDocs()
        .then(result => {
            return Promise.all(result.rows.map(row => {
                return db.remove(row.id, row.value.rev);
            }));
        })
        .then(() => {
            console.log('All documents successfully deleted');
        })
        .catch(err => {
            console.error('Error deleting documents', err);
        });
}