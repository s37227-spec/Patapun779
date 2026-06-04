// Custom Cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', function(e) {
  cursor.style.left = e.clientX - 5 + 'px';
  cursor.style.top = e.clientY - 5 + 'px';
});
 
// Scroll Reveal Animation
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
 
reveals.forEach(function(el) {
  observer.observe(el);
});
 
// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
 
