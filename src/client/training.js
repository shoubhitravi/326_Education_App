

/**
 * Sets up the initial display state of various divs and populates input fields based on
 * previously saved data in local storage.
 */
function set_up() {

    const neural_div = document.getElementById("neural-hyperparameters");
    const decision_div = document.getElementById("decision-hyperparameters");
    neural_div.style.display = 'none';
    decision_div.style.display = 'none';

    const wine_features = document.getElementById("wine-features");
    const titanic_features = document.getElementById("titanic-features");
    // wine_features.style.display = 'none';
    // titanic_features.style.display = 'none';

    populateInputsFromLocalStorage();
}

/**
 * Populates input fields (hyperparameters, selected features) from values stored in local storage, if any.
 */
function populateInputsFromLocalStorage() {
    const storedInputs = localStorage.getItem('inputs');
    if (storedInputs) {
        const inputs = JSON.parse(storedInputs);

        // Populate dataset select
        const datasetSelect = document.getElementById('dataset-select');
        for (let i = 0; i < datasetSelect.options.length; i++) {
            if (datasetSelect.options[i].textContent === inputs["dataset"]) {
                datasetSelect.selectedIndex = i;
                break;
            }
        }

        // Populate hyperparameters
        for (const inputId in inputs) {
            if (inputs.hasOwnProperty(inputId) && inputId !== "dataset") {
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    inputElement.value = inputs[inputId];
                }
            }
        }

        // Populate selected features
        for (const inputId in inputs) {
            if (inputs.hasOwnProperty(inputId) && inputs[inputId] === true) {
                const checkbox = document.getElementById(inputId);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        }
    }
}

/**
 * Displays the hyperparameter settings for the selected model.
 *
 * @param {string} modelType - The type of model to display hyperparameters for ('neural' or 'decision').
 */
function showModel(modelType) {
    // Hide all hyperparameter sections
    document.querySelectorAll('.hyperparameters').forEach(function (el) {
        el.style.display = 'none';
    });

    // Show the hyperparameter section corresponding to the selected model type
    document.getElementById(modelType + '-hyperparameters').style.display = 'block';
}

/**
 * Displays the features related to the selected dataset.
 */
function showFeatures() {
    // Hide all feature sets
    document.querySelectorAll('.feature-set').forEach(function (el) {
        el.style.display = 'none';
    });

    // Get the selected dataset
    const datasetSelect = document.getElementById('dataset-select');
    const selectedDataset = datasetSelect.value;

    // Show the feature set corresponding to the selected dataset
    document.getElementById(selectedDataset + '-features').style.display = 'block';
}


/**
 * Simulates the training process, updates the graph with random loss values, and displays
 * random test accuracy and loss on the webpage.
 */
function startTraining() {

    const inputs = extractHyperparameters();
    console.log("inputs = ")
    console.log(inputs);
    const modelType = inputs["modelType"];

    fetch('http://localhost:3000/create_model', { // Replace with your backend server URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
    })
    .then(response => response.text())
    .then(data => {
        
        console.log(data); // Handle the response from the server
        data_JSON = JSON.parse(data);
            // Update the Plotly graph
        console.log(modelType);

        
            

        if (modelType !== "Decision Tree"){
            // console.log("anshul")
            Plotly.newPlot('plotly-graph', [{
                x: data_JSON['losses'],
                y: data_JSON['losses'].map((_, index) => index + 1),
                type: 'scatter',
                mode: 'lines',
                name: 'Loss over Time'
            }], {
                title: 'Loss over Time',
                xaxis: { title: 'Iterations' },
                yaxis: { title: 'Loss' },
                height: 500
            });
            
            
        }
        else {
            // Assuming train_scores and val_scores are available as arrays

            const train_scores = data_JSON['train_scores'];
            const val_scores = data_JSON['val_scores'];
            const train_sizes = data_JSON['train_sizes'];
            console.log("train scores: ");
            console.log(train_scores);
            // Calculate mean and standard deviation for train and validation scores
            const train_mean = train_scores.map(scores => scores.reduce((a, b) => a + b, 0) / scores.length);
            const val_mean = val_scores.map(scores => scores.reduce((a, b) => a + b, 0) / scores.length);

            
            // Plot the learning curve
            const trace1 = {
            x: train_sizes,
            y: train_mean,
            mode: 'lines+markers',
            name: 'Training Score',
            line: {color: 'rgb(255, 0, 0)'},
            };

            const trace2 = {
            x: train_sizes,
            y: val_mean,
            mode: 'lines+markers',
            name: 'Validation Score',
            line: {color: 'rgb(0, 255, 0)'},
            };

            const data = [trace1, trace2];

            const layout = {
            title: 'Learning Curve',
            xaxis: {
                title: 'Number of Training Samples',
            },
            yaxis: {
                title: 'Score',
            },
            height: 500
            };

            Plotly.newPlot('plotly-graph', data, layout);
            

        }

        // if dataset is titanic, show test accuracy
        if(inputs["dataset"] === "Titanic Dataset"){
            document.getElementById('test-accuracy').textContent = data_JSON['result'].toFixed(2);
        }
        else {
            // Show the loss
            loss = document.getElementById('loss');
            loss.textContent = data_JSON['result'].toFixed(2);
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Display model data (dataset, model type, test accuracy, hyperparameters) on share page form
function displayModelData() {
    const inputs = JSON.parse(localStorage.getItem('inputs'));
    const datasetSpan = document.getElementById("dataset-span");
    const modelTypeSpan = document.getElementById("model-type-span");
    const testAccuracySpan = document.getElementById("accuracy-span");
    const lossSpan = document.getElementById("loss-span");
    const hyperparametersSpan = document.getElementById("hyperparameters-span");

    datasetSpan.textContent = inputs["dataset"];
    modelTypeSpan.textContent = inputs["modelType"];
    if(inputs["dataset"] === "Titanic Dataset"){
        testAccuracySpan.textContent = inputs["testAccuracy"];
    }
    else{
        testAccuracySpan.textContent = "N/A, is a regression problem";
    }
    if(inputs["dataset"] === "Titanic Dataset"){
        lossSpan.textContent = "N/A, is a classification problem";
    }
    else {
        lossSpan.textContent = inputs["loss"];
    }
    // console.log(inputs["dataset"])

    // Hyperparameters: 
    /*
    // Linear Regression Hyperparameters:
    // Learning rate, number of iterations, regularization

    // Decision Tree Hyperparameters:
    // Criterion, Splitter, Max Depth, Min Samples Split

    // Neural Network Hyperparameters:
    // Number of hidden layers, neurons per layer, activation function, learning rate

    */

    // Dataset Features
    /*

    // Boston Housing 
    // Per capita crime rate by town, proportion of residential land zoned for lots over 25,000 sq. ft.

    // Wine Quality
    // Fixed acidity, volatile acidity

    // Titanic
    // Passenger class, age

    */
    const hyperparameters = inputs["hyperparameters"];

    // console.log(JSON.stringify(hyperparameters));
    if (Object.keys(hyperparameters).length === 0) {
        hyperparameters.textContent = "None specified"
    }
    else {
        let hyperparametersHtml = '<ul>';
        for (const [key, value] of Object.entries(hyperparameters)) {
            hyperparametersHtml += `<li>${key}: ${value}</li>`;
        }
        hyperparametersHtml += '</ul>';

        // Insert the HTML into the DOM
        hyperparametersSpan.innerHTML = hyperparametersHtml;
    }
}


/**
 * Extracts inputs from the user form, including selected dataset, hyperparameters, and features,
 * stores them in local storage and a PouchDB database, and logs them to the console.
 *
 * @returns {Object} The inputs extracted from the form elements.
 */


function extractHyperparameters(){
    const hyperparameters = {}

    const datasetSelect = document.getElementById('dataset-select');
    const selectedText = datasetSelect.options[datasetSelect.selectedIndex].textContent;
    hyperparameters["dataset"] = selectedText;
    
    // Extract hyperparameters
    document.querySelectorAll('.hyperparameters input, .hyperparameters select').forEach(function (input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            hyperparameters[input.id] = input.value;
        }
    });

    // Extract model type
    document.querySelectorAll('.hyperparameters').forEach(function (input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            hyperparameters["modelType"] = input.querySelector('h2').textContent.split(" ").slice(0, 2).join(" ");
        }
    });
    console.log(hyperparameters);
    return hyperparameters;
}

function extractInputs() {
    const inputs = {};

    // Extract dataset
    const datasetSelect = document.getElementById('dataset-select');
    const selectedText = datasetSelect.options[datasetSelect.selectedIndex].textContent;
    inputs["dataset"] = selectedText;

    // Extract hyperparameters
    const hyperparam_obj = {}
    document.querySelectorAll('.hyperparameters input, .hyperparameters select').forEach(function (input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            hyperparam_obj[input.id] = input.value;
        }
    });
    inputs["hyperparameters"] = hyperparam_obj;
    // Extract selected features
    document.querySelectorAll('.feature-set input[type="checkbox"]').forEach(function (checkbox) {
        if (checkbox.offsetParent !== null && checkbox.checked) { // Check if the checkbox is visible and checked
            inputs[checkbox.id] = true;
        }
    });

    // Extract model type
    document.querySelectorAll('.hyperparameters').forEach(function (input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            inputs["modelType"] = input.querySelector('h2').textContent.split(" ").slice(0, 2).join(" ");
        }
    });

    // Extract Test Accuracy or Loss
    document.querySelectorAll(".results").forEach(function (input) {
        if (input.offsetParent !== null) {
            if(input.querySelector("#test-accuracy") !== null){
                inputs["testAccuracy"] = input.querySelector("#test-accuracy").textContent;
            }
            if(input.querySelector("#loss") !== null){
                inputs["loss"] = input.querySelector("#loss").textContent;
            }
        }
    }
    
    );
    inputs["comments"] = [];

    // // Extract Loss
    // document.querySelectorAll(".results").forEach(function (input) {
    //     if (input.offsetParent !== null) {
    //         inputs["loss"] = input.querySelector("#loss").textContent;
    //     }
    // }
    // );

    // Store in local storage and PouchDB
    localStorage.setItem('inputs', JSON.stringify(inputs));
    // clear database script
    // db.destroy().then(function() {
    //     console.log("database cleared successfully");
    // }).catch
    // (function(err) {
    //     console.log("error: ", err);
    // });

    // storeInputsInDB(inputs);
    // logAllContents();
    return inputs;
}


function extractResultInfo() {
    const inputs = JSON.parse(localStorage.getItem('inputs'));
    // console.log(inputs);
    // extract name
    const name = document.getElementById("name-field").value;
    // console.log(name)
    // extract how tuned
    const modelTuning = document.getElementById("model-tuning-field").value;
    // console.log(modelTuning)
    // extract how improve 
    const improvement = document.getElementById("model-improvement-field").value;
    // console.log(improvement)
    inputs["name"] = name;
    inputs["model-tuning"] = modelTuning;
    inputs["improvement"] = improvement;

    localStorage.setItem('inputs', JSON.stringify(inputs));

    storeInputsInDB(inputs);

    showSection('leaderboard')
    // logAllContents();
    return inputs;
}

// model submissions dataset
const db = new PouchDB('model_db');
// console.log(JSON.parse(localStorage.getItem('inputs')))


// /**
//  * Stores the provided input data in a PouchDB database with a unique timestamp as the ID.
//  *
//  * @param {Object} inputs - The inputs to store in the database.
//  * @returns {Promise} A promise that resolves with the response from the database operation.
//  */
function storeInputsInDB(inputs) {
    const uniqueId = Date.now().toString();
    const doc = { _id: uniqueId, ...inputs }

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
    };

    fetch('/store_inputs', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Data received from server:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}

function getAllDocs() {
    return fetch('/all_docs')
      .then(response => {
        if (!response.ok) {
          console.log("error!!!");
          throw new Error('Network response was not ok');
        }
        console.log(response);
        return response.json();
      })
      .then(docs => {
        // Process the retrieved documents
        console.log('Retrieved documents:', docs);
        return docs; // You can handle the documents here, e.g., update the leaderboard
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
      });
    }



function sortResultsByAccuracy(results) {
    results.sort(function(a, b) {
        // Ensure both values are treated as numbers
        return parseFloat(b.doc.testAccuracy) - parseFloat(a.doc.testAccuracy); // Sorting in descending order
    });
}



function populateLeaderboard() {
    // Retrieve all documents from the database
    getAllDocs()
        .then(function (result) {
            // Iterate over each document and log its contents
            // sortResultsByAccuracy(result.rows);
            console.log("populate leaderboard");
            console.log(result)
            const leaderboardContainer = document.getElementById('leaderboard');

            // clear leaderboard entries
            current_entries = leaderboardContainer.querySelectorAll('.leaderboard-entry');
            current_entries.forEach(entry => {
                entry.parentNode.removeChild(entry);
            });

            result.forEach(function (row, index) {
                // console.log(row.doc); 
                console.log(row);
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('leaderboard-entry');
                let result = "Accuracy: " + parseFloat(row["testAccuracy"]).toFixed(2);
                if (row["testAccuracy"] === ""){
                    result = "Loss: " + parseFloat(row["loss"]).toFixed(2);
                }          

                entryDiv.innerHTML = `
                    <div class="rank">${index + 1}</div>
                    <div class="name">${row["name"]}</div>
                    <div class="model-type">${row["modelType"]}</div>
                    <div class="results">${result}</div>
                    <div class="link">
                        <button onclick="showSection('results-display');  loadEntryDetails(${index})">➡️</button>
                    </div>
                `;            
                leaderboardContainer.appendChild(entryDiv);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving documents from the database:', error);
        });
}


function populateLeaderboardFromLocalStorage(dataset) {
    let entries = JSON.parse(localStorage.getItem('entries'))[dataset];
    console.log(entries);

    if(dataset === "Titanic"){
        // sortResults(entries, "accuracy");
        console.log((entries.sort((a, b) => parseFloat(b["testAccuracy"]) - parseFloat(a["testAccuracy"]))));
        // console.log(entries);
    }
    else {
        // sortResults(entries, "loss");
        console.log((entries.sort((a, b) => parseFloat(a["loss"]) - parseFloat(b["loss"]))));
        // console.log(entries);
    }
    // sortResultsByAccuracy(entries);

    const leaderboardContainer = document.getElementById('leaderboard');

    // clear leaderboard entries
    current_entries = leaderboardContainer.querySelectorAll('.leaderboard-entry');
    current_entries.forEach(entry => {
        entry.parentNode.removeChild(entry);
    });


    entries.forEach(function(entry, index){
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('leaderboard-entry');
        let result = parseFloat(entry.testAccuracy).toFixed(2);
        if (entry.testAccuracy === ""){
            result = parseFloat(entry.loss).toFixed(2);
        }
        const dataset = entry.dataset;          
        entryDiv.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="name">${entry.name}</div>
            <div class="model-type">${entry.modelType}</div>
            <div class="results">${result}</div>
            <div class="link">
                <button onclick="showSection('results-display'); loadEntryDetailsByDataset('${dataset}', ${index})">➡️</button>
            </div>
        `;
        leaderboardContainer.appendChild(entryDiv);
    


    });
}


function loadEntryDetails(index) {
    getAllDocs()
        .then(function (result) {    
        const resultsContainer = document.getElementById('results-container');
        const resultDiv = document.createElement('div');
        resultsContainer.innerHTML = '';
        console.log(index);
        console.log("loadEntryDetails");
        console.log(result);
        let theCorrespondingEntry = result[index]
        

        console.log("corresponing entry: ")
        console.log(theCorrespondingEntry);
        console.log("hyperparameters: ");
        console.log(theCorrespondingEntry["hyperparameters"]);

        // extract hyperparameters
        const hyperparameters_obj = theCorrespondingEntry["hyperparameters"];
        let hyperparameters_str = ""
        if(Object.keys(hyperparameters_obj).length === 0){
            hyperparameters_str = "None specified"
        }
        else {
            for (const [key, value] of Object.entries(hyperparameters_obj)){
                hyperparameters_str += `${key}: ${value} \n`;
            }
        }

        const detailsHtml = `
                <div class="result-detail"><strong>Name:</strong> <span>${theCorrespondingEntry.name}</span></div>
                <div class="result-detail"><strong>EntryID:</strong> <span>${theCorrespondingEntry._id}</span></div>
                <div class="result-detail"><strong>Model Type:</strong> <span>${theCorrespondingEntry.modelType}</span></div>
                <div class="result-detail"><strong>Test Accuracy:</strong> <span>${theCorrespondingEntry.testAccuracy || 'N/A, is regression problem'}</span></div>
                <div class="result-detail"><strong>Loss:</strong> <span>${theCorrespondingEntry.loss || 'N/A, is a classification problem'}</span></div>
                <div class="result-detail"><strong>Dataset:</strong> <span>${theCorrespondingEntry.dataset}</span></div>
                <div class="result-detail"><strong>Hyperparameters:</strong> <span>${hyperparameters_str}</span></div>
                <div class="result-detail"><strong>Tuning:</strong> <span>${theCorrespondingEntry["model-tuning"]}</span></div>
                <div class="result-detail"><strong>Improvements:</strong> <span>${theCorrespondingEntry.improvement}</span></div>
                <div class="result-detail">
                    <strong>Comments:</strong> <span id="comments-list">${theCorrespondingEntry.comments}</span>
                    <div id="comments-section">
                    <h2>Comments</h2>
                    <ul id="comments-list">
                        <!-- Comments will be displayed here -->
                    </ul>
                    <form id="comment-form">
                        <textarea id="comment-input" placeholder="Add a comment..." required></textarea>
                        <button type="submit" class = "submit-btn" onclick = "addCommentToCurrentEntry('${theCorrespondingEntry.dataset}', '${theCorrespondingEntry._id}')">Post Comment</button>
                    </form>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteEntry('${theCorrespondingEntry._id}')">Delete Entry</button>
            `;

            resultDiv.innerHTML = detailsHtml;
            resultsContainer.appendChild(resultDiv);
            showSection('results-display'); // Show the details section
    }).catch(function (error) {
        console.error('Error loading entry details:', error);
    });
}

function loadEntryDetailsByDataset(dataset, index) {
    // Retrieve the stored JSON string from localStorage
    const storedEntries = localStorage.getItem('entries');
    
    // Parse the JSON string back into an object
    const entries = JSON.parse(storedEntries);

    // Access the specific dataset and then the entry at the provided index
    if (dataset === "Titanic Dataset"){
        dataset = "Titanic";
    } 
    else if (dataset === "Boston Housing Dataset"){
        dataset = "Boston";
    }
    else if (dataset === "Wine Quality Dataset"){
        dataset = "Wine";
    }


    if(dataset === "Titanic"){
        // sortResults(entries, "accuracy");
        console.log((entries[dataset].sort((a, b) => parseFloat(b["testAccuracy"]) - parseFloat(a["testAccuracy"]))));
        // console.log(entries);
    }
    else {
        // sortResults(entries, "loss");
        console.log((entries[dataset].sort((a, b) => parseFloat(a["loss"]) - parseFloat(b["loss"]))));
        // console.log(entries);
    }



    console.log(entries)
    console.log(dataset)
    console.log(index)
    const theCorrespondingEntry = entries[dataset][index];
    // console.log(entries[dataset][0])
    // console.log(theCorrespondingEntry)

    const resultsContainer = document.getElementById('results-container');
    const resultDiv = document.createElement('div');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Handling for hyperparameters
    let hyperparameters_str = "";
    const hyperparameters_obj = theCorrespondingEntry["hyperparameters"];
    if (Object.keys(hyperparameters_obj).length === 0) {
        hyperparameters_str = "None specified";
    } else {
        for (const [key, value] of Object.entries(hyperparameters_obj)) {
            hyperparameters_str += `${key}: ${value} \n`;
        }
    }

    // Build HTML with the entry details
    const detailsHtml = `
        <div class="result-detail"><strong>Name:</strong> <span>${theCorrespondingEntry.name}</span></div>
        <div class="result-detail"><strong>EntryID:</strong> <span>${theCorrespondingEntry._id}</span></div>
        <div class="result-detail"><strong>Model Type:</strong> <span>${theCorrespondingEntry.modelType}</span></div>
        <div class="result-detail"><strong>Test Accuracy:</strong> <span>${theCorrespondingEntry.testAccuracy || 'N/A, is regression problem'}</span></div>
        <div class="result-detail"><strong>Loss:</strong> <span>${theCorrespondingEntry.loss || 'N/A, is a classification problem'}</span></div>
        <div class="result-detail"><strong>Dataset:</strong> <span>${theCorrespondingEntry.dataset}</span></div>
        <div class="result-detail"><strong>Hyperparameters:</strong> <span>${hyperparameters_str}</span></div>
        <div class="result-detail"><strong>Tuning:</strong> <span>${theCorrespondingEntry["model-tuning"]}</span></div>
        <div class="result-detail"><strong>Improvements:</strong> <span>${theCorrespondingEntry.improvement}</span></div>
        <div class="result-detail">
            <strong>Comments:</strong> <span id="comments-list">${theCorrespondingEntry.comments}</span>
            <div id="comments-section">
            <h2>Comments</h2>
            <ul id="comments-list">
                <!-- Comments will be displayed here -->
            </ul>
            <form id="comment-form">
                <textarea id="comment-input" placeholder="Add a comment..." required></textarea>
                <button type="submit" class = "submit-btn" onclick = "addCommentToCurrentEntry('${theCorrespondingEntry.dataset}', '${theCorrespondingEntry._id}')">Post Comment</button>
            </form>
            </div>
        </div>
        <button class="delete-btn" onclick="deleteEntry('${theCorrespondingEntry._id}')">Delete Entry</button>
    `;

    resultDiv.innerHTML = detailsHtml;
    resultsContainer.appendChild(resultDiv);
    showSection('results-display'); // Assuming there's a function to display the results section
}

function addCommentToCurrentEntry(dataset, entry_id) {


    const commentInput = document.getElementById('comment-input');
    const comment = commentInput.value;

    if(dataset === "Titanic Dataset"){
        dataset = "Titanic";
    }
    else if(dataset === "Boston Housing Dataset"){
        dataset = "Boston";
    }
    else if(dataset === "Wine Quality Dataset"){
        dataset = "Wine";
    }


    const entries = JSON.parse(localStorage.getItem('entries'));
    const entriesArray = entries[dataset];
    for(const entry of entriesArray){
        if(entry._id === entry_id){
            if(entry.comments === undefined){
                entry.comments = [];
            }
            console.log(entry)
            entry.comments.push(comment);

            document.getElementById("comments-list").innerHTML = entry.comments.map(comment => `${comment}<br>`).join('');

            const comments = entry.comments;
            const id = entry._id;

            
            fetch('/update_comments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, comments })
            })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(new Error(response.statusText));
                }
                return response;
            });
            



        }
    }

    localStorage.setItem('entries', JSON.stringify(entries));
    
    commentInput.value = '';



}

function updateComment(id, comments){

}


function loadDBtoLocalStorage() {
    console.log("load db to local storage");
    getAllDocs()
        .then(function (result) {
            // Iterate over each document and log its contents
            const entries = {};
            entries["Boston"] = [];
            entries["Wine"] = [];
            entries["Titanic"] = [];
            result.forEach(function(row){
                const entry = row;
                if(entry.dataset === "Boston Housing Dataset"){
                    entries["Boston"].push(entry);
                }
                if(entry.dataset === "Wine Quality Dataset"){
                    entries["Wine"].push(entry);
                }
                if(entry.dataset === "Titanic Dataset"){
                    entries["Titanic"].push(entry);
                }
            })
            

            localStorage.setItem('entries', JSON.stringify(entries));

            console.log(JSON.parse(localStorage.getItem('entries')));

            console.log(JSON.parse(localStorage.getItem('entries'))["Boston"][0]);

        })
        .catch(function (error) {
            console.error('Error retrieving documents from the database:', error);
        });
}

async function deleteEntry(input) {
    try {
      const response = await fetch('/delete_entry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id : input}),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
    } catch (error) {
      throw new Error(`Error deleting entry: ${error.message}`);
    }
  }



window.onload = set_up;

window.addEventListener('load', function(){
    this.document.getElementById('dataset-select').value = "boston";
    this.document.getElementById('test-accuracy-container').style.display = 'none';
});

// Hide buttons and features that are not relevant to the current dataset
document.getElementById('dataset-select').addEventListener('change', function(){
    var selectedDataset = this.value;

    // hide the test accuracy container and linear regression model option because titanic is a classification dataset
    if(selectedDataset == "titanic"){
        document.getElementById('lg-button').style.display = 'none';
        document.getElementById('dt-button').style.display = 'block';
        document.getElementById('nn-button').style.display = 'block';
        document.getElementById('test-accuracy-container').style.display = 'block';
        document.getElementById('loss-container').style.display = 'none';
        document.getElementById('dt-button').click();
    }

    if(selectedDataset == "wine" || selectedDataset == "boston"){
        document.getElementById('lg-button').style.display = 'block';
        document.getElementById('dt-button').style.display = 'block';
        document.getElementById('nn-button').style.display = 'block';
        document.getElementById('loss-container').style.display = 'block';
        document.getElementById('test-accuracy-container').style.display = 'none';
    }
})

document.getElementById('dataset-dropdown').addEventListener('change', function(){
    var selectedDataset = this.value;

    if(selectedDataset === "dataset1"){
        populateLeaderboardFromLocalStorage("Boston");
    }
    else if(selectedDataset === "dataset2"){
        populateLeaderboardFromLocalStorage("Wine");
    }
    else if(selectedDataset === "dataset3"){
        populateLeaderboardFromLocalStorage("Titanic");
    }
    else{
        populateLeaderboard();
    }
});

window.addEventListener('load', populateLeaderboard);
window.addEventListener('load', loadDBtoLocalStorage);
// window.addEventListener('load', clearDatabase);
