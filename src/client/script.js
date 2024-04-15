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
