/**
 * Hides all sections and then displays the section with the specified sectionID.
 *
 * @param {string} sectionId - The ID of the section to display.
 */
function showSection(sectionId) {
  // Hide all sections first
  const sections = document.querySelectorAll('.content');
  sections.forEach(section => {
      section.style.display = 'none';
  });

  // Show the requested section
  const activeSection = document.getElementById(sectionId);
  activeSection.style.display = 'block';
}


/**
 * Initiates the modeling process for the selected dataset.
 * It hides the dataset selection page and shows the training page with the corresponding dataset features.
 * It also sets the value of the dataset select element and calls showFeatures to update the UI.
 *
 * @param {string} datasetId - The ID of the dataset chosen for modeling.
 */
function startModeling(datasetId) {
  document.getElementById('datasets').style.display = 'none'; // Hide dataset selection
  document.getElementById('training').style.display = 'block'; // Show training section
  const selectElement = document.getElementById('dataset-select');
  selectElement.value = datasetId;
  showFeatures(datasetId); // Call to update the page based on the selected dataset

}



/**
 * Displays the features associated with the selected dataset.
 * It hides all other dataset features and only shows the relevant ones.
 *
 * @param {string} datasetId - The ID of the dataset whose features are to be displayed.
 */
function showFeatures(datasetId) {
  // Implement the feature showing logic based on dataset
  if(datasetId==="titanic"){
    document.getElementById('boston-features').style.display = 'none';
    document.getElementById('wine-features').style.display = 'none';
    document.getElementById('titanic-features').style.display = 'block';

  }
  else if(datasetId==="boston"){
    document.getElementById('titanic-features').style.display = 'none';
    document.getElementById('wine-features').style.display = 'none';
    document.getElementById('boston-features').style.display = 'block';
  }
  else if(datasetId==="wine"){
    document.getElementById('boston-features').style.display = 'none';
    document.getElementById('titanic-features').style.display = 'none';
    document.getElementById('wine-features').style.display = 'block';

  }
}

/**
 * Starts the user's journey by hiding the home section and displaying the datasets section.
 */
function startJourney(){
  document.getElementById('home').style.display = 'none';
  document.getElementById('datasets').style.display = 'block';

}