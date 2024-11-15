// Importuj style i niezbędne komponenty Bootstrap
import "../scss/styles.scss";
import pricingTemplate from "../pricing.html";
import { Tooltip } from "bootstrap";
import translations from './translations.js';

export function initPricingTable(containerId, lang) {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Nie znaleziono kontenera z ID: ${containerId}`);
      return;
    }

    container.innerHTML = pricingTemplate;

    // Filtruj i stosuj tłumaczenia tylko dla bieżącego kontenera
    applyTranslations(container, lang);

    const tooltipTriggerList = container.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });

    const priceSwitch = container.querySelector("#priceConversionSwitch");

    if (priceSwitch) {
      priceSwitch.addEventListener("change", updatePriceDisplay);
      updatePriceDisplay();
  } else {
      console.error("Nie znaleziono elementu #priceConversionSwitch w kontenerze");
  }

    function updatePriceDisplay() {
      const isChecked = priceSwitch.checked;

      container.querySelectorAll(".container-price").forEach((container) => {
        const containerPlan = container.closest(".container-plan");

        if (isChecked) {
          if (container.dataset.priceBillingType === "monthly") {
            container.style.display = "none";
          } else {
            container.style.display = "block";
            if (containerPlan) {
              containerPlan.dataset.priceBillingSelected = "annual";
            }
          }
        } else {
          if (container.dataset.priceBillingType === "monthly") {
            container.style.display = "block";
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
    updatePriceDisplay();

    const button = container.querySelector("#comparisonTableButton");

   if (button) {
     console.log("Przycisk znaleziony", button);
     const icon = button.querySelector(".icon");
     const collapseElement = container.querySelector("#comparisonTable");
   
     if (collapseElement) {
        collapseElement.addEventListener("show.bs.collapse", function () {
          if (icon) {
            icon.classList.remove("icon-down");
            icon.classList.add("icon-up");
          } else {
            console.error("Nie znaleziono ikony w przycisku");
          }
        });
   
        collapseElement.addEventListener("hidden.bs.collapse", function () {
          if (icon) {
            icon.classList.remove("icon-up");
            icon.classList.add("icon-down");
          } else {
            console.error("Nie znaleziono ikony w przycisku");
          }
        });
     } else {
       console.error("Nie znaleziono elementu #comparisonTable w kontenerze");
     }
   } else {
     console.error("Nie znaleziono elementu #comparisonTableButton w kontenerze");
   }

    const url = "https://webwavecms.com/webwaveWebsites/getPricingDataForUser";

    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const currentPlanLevel = data.currentPlanLevel;

        const currencyFormats = {
          USD: { symbol: "$", position: "before" },
          AUD: { symbol: "$", position: "before" },
          PLN: { symbol: "zł", position: "after" },
          EUR: { symbol: "€", position: "before" },
          RON: { symbol: "lei", position: "after" },
          GBP: { symbol: "£", position: "before" },
        };

        function formatPrice(value, currency) {
          const { symbol, position } = currencyFormats[currency] || {};
          if (!symbol) return `${value} ${currency}`;

          switch (position) {
            case "before":
              return `${symbol}${value}`;
            case "after":
              return `${value} ${symbol}`;
            default:
              return `${value} ${currency}`;
          }
        }

        data.plans.forEach((plan) => {
          const planLevel = plan.level;
          const planName = plan.planName;
          const priceFor12Month = Math.round((plan.priceFor12Month / 12) * 0.75);
          const defaultPriceForPlan = plan.defaultPriceForPlan;
          const currency = data.currency;

          const containerPlan = container.querySelector(
            `[data-plan-level="${planLevel}"]`
          );

          if (containerPlan) {
            containerPlan.querySelector(".plan-name").innerHTML = planName;

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

            const parentCol = containerPlan.closest(".col");

            if (parentCol) {
              if (containerPlan.dataset.planLevel === currentPlanLevel) {
                containerPlan.dataset.active = "true";
                parentCol.style.display = "";
              } else if (containerPlan.dataset.planLevel < currentPlanLevel) {
                parentCol.style.display = "none";
              } else {
                parentCol.style.display = "";
              }
            }

            container.querySelectorAll(".button-buy-plan").forEach((button) => {
              button.addEventListener("click", function () {
                const planContainer = this.closest(
                  ".container-plan[data-plan-level]"
                );
                if (planContainer) {
                  const planLevel = planContainer.dataset.planLevel;
                  const billingType =
                    planContainer.dataset.priceBillingSelected;

                  window.location.hash = `planLevel=${planLevel}&billingType=${billingType}`;
                }
              });
            });
          }
        });
      });
  });
}

function applyTranslations(container, lang) {
  console.log(`Applying translations for language: ${lang}`);
  if (translations && translations[lang]) {
    container.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      } else {
        console.warn(`Translation key '${key}' not found in language '${lang}'`);
      }
    });
  } else {
    console.error('Translations not found for the selected language.');
  }
}