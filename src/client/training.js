

// set different displays
function set_up(){
    
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

function showModel(modelType) {
    // Hide all hyperparameter sections
    document.querySelectorAll('.hyperparameters').forEach(function(el) {
        el.style.display = 'none';
    });

    // Show the hyperparameter section corresponding to the selected model type
    document.getElementById(modelType + '-hyperparameters').style.display = 'block';
}


function showFeatures() {
    // Hide all feature sets
    document.querySelectorAll('.feature-set').forEach(function(el) {
        el.style.display = 'none';
    });

    // Get the selected dataset
    const datasetSelect = document.getElementById('dataset-select');
    const selectedDataset = datasetSelect.value;

    // Show the feature set corresponding to the selected dataset
    document.getElementById(selectedDataset + '-features').style.display = 'block';
}



function startTraining() {
    // Simulate training with fake data
    let iterations = [];
    let lossValues = [];

    const tAcc = document.getElementById("test-accuracy");
    const loss = document.getElementById("loss");

    const maxIterations = 100;
    for (let i = 1; i <= maxIterations; i++) {
        iterations.push(i);
        lossValues.push(Math.random() * 100); // Random value for demonstration
    }

    // Update the Plotly graph
    Plotly.newPlot('plotly-graph', [{
        x: iterations,
        y: lossValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Loss over Time'
    }], {
        title: 'Loss over Time',
        xaxis: { title: 'Iterations' },
        yaxis: { title: 'Loss' }
    });
    tAcc.textContent = (Math.random() * 100).toFixed(2) + "%";
    loss.textContent = (Math.random() * 1000).toFixed(2);
}


function extractInputs() {
    const inputs = {};

    // Extract dataset
    const datasetSelect = document.getElementById('dataset-select');
    const selectedText = datasetSelect.options[datasetSelect.selectedIndex].textContent;
    inputs["dataset"] = selectedText;

    // Extract hyperparameters
    document.querySelectorAll('.hyperparameters input, .hyperparameters select').forEach(function(input) {
        if (input.offsetParent !== null) { // Check if the input is visible
            inputs[input.id] = input.value;
        }
    });

    // Extract selected features
    document.querySelectorAll('.feature-set input[type="checkbox"]').forEach(function(checkbox) {
        if (checkbox.offsetParent !== null && checkbox.checked) { // Check if the checkbox is visible and checked
            inputs[checkbox.id] = true;
        }
    });

    // Store in local storage and PouchDB
    localStorage.setItem('inputs', JSON.stringify(inputs));
    storeInputsInDB(inputs);
    logAllContents();
    return inputs;
}

// model submissions dataset
const db = new PouchDB('model_db');

function storeInputsInDB(inputs) {
    const uniqueId = Date.now().toString();

    const doc = { _id: uniqueId, ...inputs}
    
    return db.put(doc);
}


function logAllContents() {
    // Retrieve all documents from the database
    db.allDocs({ include_docs: true })
        .then(function(result) {
            // Iterate over each document and log its contents
            result.rows.forEach(function(row) {
                console.log(row.doc); // Log the document contents
            });
        })
        .catch(function(error) {
            console.error('Error retrieving documents from the database:', error);
        });
}



window.onload = set_up;