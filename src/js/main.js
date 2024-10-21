// Import our custom CSS
import "../scss/styles.scss";

// Import only the Bootstrap components we need
import { Tooltip } from "bootstrap";

document.addEventListener("DOMContentLoaded", function () {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl); // Inicjalizacja każdego tooltipu
  });

  const priceSwitch = document.getElementById("priceConversionSwitch");

  function updatePriceDisplay() {
    const isChecked = priceSwitch.checked;

    document.querySelectorAll(".container-price").forEach((container) => {
      const containerPlan = container.closest(".container-plan");

      if (isChecked) {
        if (container.dataset.priceBillingType === "monthly") {
          container.style.display = "none";
        } else {
          container.style.display = "block";

          // Aktualizacja data-price-billing-selected
          if (containerPlan) {
            containerPlan.dataset.priceBillingSelected = "annual";
          }
        }
      } else {
        if (container.dataset.priceBillingType === "monthly") {
          container.style.display = "block";

          // Aktualizacja data-price-billing-selected
          if (containerPlan) {
            containerPlan.dataset.priceBillingSelected = "monthly";
          }
        } else {
          container.style.display = "none";
        }
      }
    });
  }

  priceSwitch.addEventListener("change", updatePriceDisplay);
  updatePriceDisplay(); // initial call to set the correct display

  // Przyciski i ikony
  const button = document.getElementById("comparisonTableButton");
  const icon = button.querySelector(".icon");
  const collapseElement = document.getElementById("comparisonTable");

  // Dodanie event listenera dla zdarzeń 'show' i 'hide' dla elementu collapse
  collapseElement.addEventListener("show.bs.collapse", function () {
    icon.classList.remove("icon-down");
    icon.classList.add("icon-up");
  });

  collapseElement.addEventListener("hidden.bs.collapse", function () {
    icon.classList.remove("icon-up");
    icon.classList.add("icon-down");
  });

  const url = "https://webwavecms.com/webwaveWebsites/getPricingDataForUser";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const currentPlanLevel = data.currentPlanLevel;

      // Mapa symboli i pozycji walut
      const currencyFormats = {
        USD: { symbol: "$", position: "before" },
        AUD: { symbol: "$", position: "before" },
        PLN: { symbol: "zł", position: "after" },
        EUR: { symbol: "€", position: "before" },
        RON: { symbol: "lei", position: "after" },
        GBP: { symbol: "£", position: "before" },
      };

      // Funkcja do formatowania ceny z walutą
      function formatPrice(value, currency) {
        const { symbol, position } = currencyFormats[currency] || {};
        if (!symbol) return `${value} ${currency}`; // Domyślne dla nieznanej waluty

        switch (position) {
          case "before":
            return `${symbol}${value}`; // Symbol przed wartością
          case "after":
            return `${value} ${symbol}`; // Symbol po wartości
          case "top":
            return `<sup>${symbol}</sup>${value}`; // Symbol na górze
          case "bottom":
            return `${value}<sub>${symbol}</sub>`; // Symbol na dole
          default:
            return `${value} ${currency}`; // Domyślne, jeśli pozycji nie określono
        }
      }

      // Pętla po wszystkich planach
      data.plans.forEach((plan) => {
        const planLevel = plan.level;
        const planName = plan.planName;
        //const priceFor12Month = plan.priceFor12Month;
        const priceFor12Month = Math.round((plan.priceFor12Month / 12) * 0.75); //Fikcyjna promocja (du usinięcia)
        const defaultPriceForPlan = plan.defaultPriceForPlan;
        const currency = data.currency;

        const containerPlan = document.querySelector(
          `[data-plan-level="${planLevel}"]`
        );

        if (containerPlan) {
          // Ustawianie nazw i cen
          containerPlan.querySelector(".plan-name").innerHTML = planName;

          // Zmiana cen w odpowiednich kontenerach
          const monthlyPriceContainer = containerPlan.querySelector(
            '[data-price-billing-type="monthly"] .price-value'
          );
          const annualPriceContainer = containerPlan.querySelector(
            '[data-price-billing-type="annual"] .price-value'
          );

          if (monthlyPriceContainer) {
            monthlyPriceContainer.innerHTML = formatPrice(
              defaultPriceForPlan,
              currency
            );
          }

          if (annualPriceContainer) {
            annualPriceContainer.innerHTML = formatPrice(
              priceFor12Month,
              currency
            );
          }

          // Ustawianie widoczności i wyróżnienia
          const parentCol = containerPlan.closest(".col"); // Znajdź rodzica `.col` dla danego `containerPlan`

          if (parentCol) {
            // Sprawdź, czy element `.col` istnieje
            if (containerPlan.dataset.planLevel === currentPlanLevel) {
              containerPlan.dataset.active = "true";
              parentCol.style.display = ""; // Pokaż element dla wyróżnionego planu
            } else if (containerPlan.dataset.planLevel < currentPlanLevel) {
              parentCol.style.display = "none"; // Ukryj element `.col` dla planów poniżej poziomu
            } else {
              parentCol.style.display = ""; // Upewnij się, że inne elementy nie są ukrywane
            }
          } else {
            console.error("Brak elementu rodzica .col dla tego kontenera");
          }

          // Nasłuchuj kliknięcia przycisku zakupu
          document.querySelectorAll(".button-buy-plan").forEach((button) => {
            button.addEventListener("click", function () {
              // Znajdź kontener planu dla tego przycisku
              const planContainer = this.closest(
                ".container-plan[data-plan-level]"
              );
              if (planContainer) {
                // Odczyt danych z kontenera
                const planLevel = planContainer.dataset.planLevel;
                const billingType = planContainer.dataset.priceBillingSelected; // Oczekujemy, że zawiera wybraną opcję 'monthly' lub 'annual'

                // Aktualizacja URL
                window.location.hash = `planLevel=${planLevel}&billingType=${billingType}`;
              } else {
                console.error(
                  "Brak elementu .container-plan z odpowiednim data-plan-level"
                );
              }
            });
          });
        }
      });
    });
});
