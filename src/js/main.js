// Importuj style i niezbędne komponenty Bootstrap
import "../scss/styles.scss";
import pricingTemplate from "../pricing.html";
import { Tooltip } from "bootstrap";

// Eksportowanie funkcji inicjalizacyjnej
export function initPricingTable(containerId) {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Nie znaleziono kontenera z ID: ${containerId}`);
      return;
    }

    container.innerHTML = pricingTemplate;

    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
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

    const button = document.getElementById("comparisonTableButton");
    const icon = button.querySelector(".icon");
    const collapseElement = document.getElementById("comparisonTable");

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

        const currentPlanLevel = data.currentPlanLevel; //Zmienna z JSON 




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

        data.plans.forEach((plan) => {      //Zmienna z JSON 
          const planLevel = plan.level;     //Zmienna z JSON 
          const planName = plan.planName;   //Zmienna z JSON 
          const priceFor12Month = Math.round((plan.priceFor12Month / 12) * 0.75);   //Zmienna z JSON 
          const defaultPriceForPlan = plan.defaultPriceForPlan;   //Zmienna z JSON 
          const currency = data.currency;   //Zmienna z JSON 

          const containerPlan = document.querySelector(
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

            document.querySelectorAll(".button-buy-plan").forEach((button) => {
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