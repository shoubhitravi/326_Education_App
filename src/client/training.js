

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
    wine_features.style.display = 'none';
    titanic_features.style.display = 'none';

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
    
    const loss = document.getElementById("loss");

    const inputs = extractHyperparameters();

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
        loss.textContent = data_JSON['mse'].toFixed(2);;
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
    const hyperparametersSpan = document.getElementById("hyperparameters-span");

    datasetSpan.textContent = inputs["dataset"];
    modelTypeSpan.textContent = inputs["modelType"];
    testAccuracySpan.textContent = inputs["testAccuracy"];
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
    const hyperparameters = {};
    for (const key in inputs) {
        if (key === "dataset" || key === "modelType" || key === "testAccuracy") {
            continue;
        }
        else {
            hyperparameters[key] = inputs[key];
        }
    }

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
    document.querySelectorAll('.hyperparameters input, .hyperparameters select').forEach(function (input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            inputs[input.id] = input.value;
        }
    });

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

    // Extract Test Accuracy
    document.querySelectorAll(".results").forEach(function (input) {
        if (input.offsetParent !== null) {
            inputs["testAccuracy"] = input.querySelector("#test-accuracy").textContent;
        }
    }
    );

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
    // logAllContents();
    return inputs;
}

// model submissions dataset
const db = new PouchDB('model_db');
console.log(JSON.parse(localStorage.getItem('inputs')))
/**
 * Stores the provided input data in a PouchDB database with a unique timestamp as the ID.
 *
 * @param {Object} inputs - The inputs to store in the database.
 * @returns {Promise} A promise that resolves with the response from the database operation.
 */
function storeInputsInDB(inputs) {
    const uniqueId = Date.now().toString();

    const doc = { _id: uniqueId, ...inputs }

    return db.put(doc);
}

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

function sortResultsByAccuracy(results) {
    results.sort(function(a, b) {
        // Ensure both values are treated as numbers
        return parseFloat(b.doc.testAccuracy) - parseFloat(a.doc.testAccuracy); // Sorting in descending order
    });
}
/**
 * Logs all contents of the PouchDB database to the console.
 */
function populateLeaderboard() {
    // Retrieve all documents from the database
    db.allDocs({ include_docs: true })
        .then(function (result) {
            // Iterate over each document and log its contents
            sortResultsByAccuracy(result.rows);
            const leaderboardContainer = document.getElementById('leaderboard');
            result.rows.forEach(function (row, index) {
                    // console.log(row.doc); 
                    const entryDiv = document.createElement('div');
                    entryDiv.classList.add('leaderboard-entry');          
                    entryDiv.innerHTML = `
                        <div class="rank">${index + 1}</div>
                        <div class="name">${row.doc.name}</div>
                        <div class="model-type">${row.doc.modelType}</div>
                        <div class="results">${row.doc.testAccuracy}</div>
                        <div class="link">
                            <button onclick="showSection('results-display'); loadEntryDetails(${index})">➡️</button>
                        </div>
                    `;            
                    leaderboardContainer.appendChild(entryDiv);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving documents from the database:', error);
        });
}

function loadEntryDetails(index) {
    db.allDocs({ include_docs: true })
        .then(function (result) {    
        const resultsContainer = document.getElementById('results-container');
        const resultDiv = document.createElement('div');
        resultsContainer.innerHTML = '';
        console.log(result.rows[index].doc)
        let theCorrespondingEntry = result.rows[index].doc
        const detailsHtml = `
                <div class="result-detail"><strong>Name:</strong> <span>${theCorrespondingEntry.name}</span></div>
                <div class="result-detail"><strong>Model Type:</strong> <span>${theCorrespondingEntry.modelType}</span></div>
                <div class="result-detail"><strong>Test Accuracy:</strong> <span>${theCorrespondingEntry.testAccuracy || 'N/A'}</span></div>
                <div class="result-detail"><strong>Dataset:</strong> <span>${theCorrespondingEntry.dataset}</span></div>
                <div class="result-detail"><strong>Hyperparameters:</strong> <span>${theCorrespondingEntry.hyperparameters}</span></div>
                <div class="result-detail"><strong>Tuning:</strong> <span>${theCorrespondingEntry.modelTuning}</span></div>
                <div class="result-detail"><strong>Improvements:</strong> <span>${theCorrespondingEntry.improvement}</span></div>
            `;

            resultDiv.innerHTML = detailsHtml;
            resultsContainer.appendChild(resultDiv);
            showSection('results-display'); // Show the details section
    }).catch(function (error) {
        console.error('Error loading entry details:', error);
    });
}


// function loadResults() {
//     // Fetch all documents from the database
//     db.allDocs({ include_docs: true })
//         .then(function (result) {
//             // Optionally sort the results by accuracy if necessary
//             // result.rows.sort((a, b) => (b.doc.testAccuracy || 0) - (a.doc.testAccuracy || 0));

//             const resultsContainer = document.getElementById('results-display');

//             // Iterate over each document and create HTML for each entry
//             result.rows.forEach((row, index) => {
//                 const resultDiv = document.createElement('div');
//                 console.log("name name name" + row.doc.name);
//                 resultDiv.innerHTML = `
//                     <div class="rank">${index + 1}</div>
//                     <div class="name">${row.doc.name}</div>
//                     <div class="model-type">${row.doc.modelType}</div>
//                     <div class="accuracy"><strong>Test Accuracy:</strong> ${row.doc.testAccuracy || 'N/A'}</div>
//                     <div class="dataset"><strong>Dataset:</strong> ${row.doc.dataset}</div>
//                     <div class="hyperparameters"><strong>Hyperparameters:</strong> ${row.doc.hyperparameters}</div>
//                     <div class="tuning"><strong>Tuning:</strong> ${row.doc.modelTuning}</div>
//                     <div class="improvements"><strong>Improvements:</strong> ${row.doc.improvement}</div>
//                     <div class="link"><button onclick="showSection('results-display')">➡️ View Details</button></div>
//                 `;

//                 resultsContainer.appendChild(resultDiv); // Append to the correct container
//             });
//         })
//         .catch(error => {
//             console.error('Error loading results:', error);
//         });
// }



window.onload = set_up;

// db content which is logged is unavaiable after page reload (like when form is submitted)
window.addEventListener('load', populateLeaderboard);
window.addEventListener('load', loadEntryDetails);