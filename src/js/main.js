// Import our custom CSS
import '../scss/styles.scss';

// Import only the Bootstrap components we need
import { Tooltip } from 'bootstrap';
//import { Popover } from 'bootstrap';


document.addEventListener('DOMContentLoaded', function() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new Tooltip(tooltipTriggerEl); // Inicjalizacja każdego tooltipu
  });
});


  document.addEventListener("DOMContentLoaded", function () {
    const priceConversionSwitch = document.getElementById("priceConversionSwitch");
  
    function updatePriceDisplay() {
      const isChecked = priceConversionSwitch.checked;
      const priceElements = document.querySelectorAll(".priceConversionDisplay");
  
      priceElements.forEach(element => {
        const monthlyElement = element.querySelector('[data-conversion-type="monthly"]');
        const annualElement = element.querySelector('[data-conversion-type="annual"]');
  
        if (isChecked) {
          if (monthlyElement) {
            monthlyElement.style.display = "none";  // Pokaż
          }
          if (annualElement) {
            annualElement.style.display = "block";   // Ukryj
          }
        } else {
          if (monthlyElement) {
            monthlyElement.style.display = "block";  // Ukryj
          }
          if (annualElement) {
            annualElement.style.display = "none";  // Pokaż
          }
        }
      });
    }
  
    // Nasłuchuje na zmianę stanu checkboxa
    priceConversionSwitch.addEventListener("change", updatePriceDisplay);
  
    // Initial call to set the correct display based on the initial state
    updatePriceDisplay();
  });




   // Przyciski i ikony
   const button = document.getElementById('comparisonTableButton');
   const icon = button.querySelector('.icon');
   const collapseElement = document.getElementById('comparisonTable');

   // Dodanie event listenera dla zdarzeń 'show' i 'hide' dla elementu collapse
   collapseElement.addEventListener('show.bs.collapse', function () {
       icon.classList.remove('icon-down');
       icon.classList.add('icon-up');
   });

   collapseElement.addEventListener('hidden.bs.collapse', function () {
       icon.classList.remove('icon-up');
       icon.classList.add('icon-down');
   });