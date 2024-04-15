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

// Optionally, you can automatically load the "Home" section when the page loads
window.onload = function() {
  showSection('home');
};
