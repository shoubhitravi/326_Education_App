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

function startModeling(datasetId) {
  document.getElementById('datasets').style.display = 'none'; // Hide dataset selection
  document.getElementById('training').style.display = 'block'; // Show training section
  const selectElement = document.getElementById('dataset-select');
  selectElement.value = datasetId;
  showFeatures(datasetId); // Call to update the page based on the selected dataset

}

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

function startJourney(){
  document.getElementById('home').style.display = 'none';
  document.getElementById('datasets').style.display = 'block';

}