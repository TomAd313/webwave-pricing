import styles from "../scss/styles.module.scss"; // Import CSS Modules
import pricingTemplate from "../pricing.html";
import { Tooltip } from "bootstrap";
import translations from "./translations.js";

console.log(styles);

export function initPricingTable(containerId, lang) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Nie znaleziono kontenera z ID: ${containerId}`);
    return;
  }

  container.innerHTML = pricingTemplate;

  // Zastosuj tłumaczenia
  applyTranslations(container, lang);

  // Zastosowanie stylów z CSS Modules
  applyStylesFromModule(container);

  // Inicjalizacja Tooltip Bootstrap
  const tooltipTriggerList = Array.from(
    container.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
  );

  const priceSwitch = container.querySelector("#priceConversionSwitch");
  if (priceSwitch) {
    const updatePriceDisplay = () => {
      const isChecked = priceSwitch.checked;
      container
        .querySelectorAll(".container-price")
        .forEach((priceContainer) => {
          const containerPlan = priceContainer.closest(".container-plan");
          if (containerPlan) {
            const isMonthly =
              priceContainer.dataset.priceBillingType === "monthly";
            priceContainer.style.display =
              isMonthly ^ isChecked ? "block" : "none";
            containerPlan.dataset.priceBillingSelected = isChecked
              ? "annual"
              : "monthly";
          }
        });
    };

    priceSwitch.addEventListener("change", updatePriceDisplay);
    updatePriceDisplay();
  } else {
    console.error(
      "Nie znaleziono elementu #priceConversionSwitch w kontenerze"
    );
  }

  const button = container.querySelector("#comparisonTableButton");

  if (button) {
    const icon = button.querySelector(".icon");
    if (icon) {
      icon.classList.add(styles["icon-down"]);
    }

    const collapseElement = container.querySelector("#comparisonTable");
    if (collapseElement) {
      collapseElement.classList.add(styles["collapse"]);
    
      collapseElement.addEventListener("show.bs.collapse", () => {
        collapseElement.classList.add(styles["collapsing"]);
        collapseElement.classList.remove(styles["collapse"]);
        collapseElement.style.height = null; // Resetowanie wysokości na auto

        if (icon) {
          icon.classList.replace(styles["icon-down"], styles["icon-up"]);
        }
      });
    
      collapseElement.addEventListener("shown.bs.collapse", () => {
        collapseElement.classList.remove(styles["collapsing"]);
        collapseElement.classList.add(styles["show"]);
        collapseElement.style.height = 'auto'; // Przypisanie wysokości auto



      });
    
      collapseElement.addEventListener("hide.bs.collapse", () => {
        collapseElement.classList.add(styles["collapsing"]);
        collapseElement.classList.remove(styles["show"]);
        collapseElement.style.height = `${collapseElement.scrollHeight}px`; // Obliczanie animacji w przeciwnym kierunku

        if (icon) {
          icon.classList.replace(styles["icon-up"], styles["icon-down"]);
        }
      });
    
      collapseElement.addEventListener("hidden.bs.collapse", () => {
        collapseElement.classList.remove(styles["collapsing"]);
        collapseElement.classList.add(styles["collapse"]);
        collapseElement.style.height = null; // Ukrywanie animacji

      });
    }

else {
  console.error("Nie znaleziono elementu #comparisonTable w kontenerze");
}
  }

  fetch("https://webwavecms.com/webwaveWebsites/getPricingDataForUser")
    .then((response) => response.json())
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

      const formatPrice = (value, currency) => {
        const { symbol, position } = currencyFormats[currency] || {};
        return symbol
          ? position === "before"
            ? `${symbol}${value}`
            : `${value} ${symbol}`
          : `${value} ${currency}`;
      };

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
          containerPlan.querySelector(".plan-name").textContent = planName;

          const monthlyPriceContainer = containerPlan.querySelector(
            '[data-price-billing-type="monthly"] .price-value'
          );
          const annualPriceContainer = containerPlan.querySelector(
            '[data-price-billing-type="annual"] .price-value'
          );

          if (monthlyPriceContainer) {
            monthlyPriceContainer.textContent = formatPrice(
              defaultPriceForPlan,
              currency
            );
          }
          if (annualPriceContainer) {
            annualPriceContainer.textContent = formatPrice(
              priceFor12Month,
              currency
            );
          }

          const parentCol = containerPlan.closest(".col");
          if (parentCol) {
            parentCol.style.display =
              planLevel === currentPlanLevel
                ? ""
                : planLevel < currentPlanLevel
                ? "none"
                : "";
            if (containerPlan.dataset.planLevel === `${currentPlanLevel}`)
              containerPlan.dataset.active = "true";
          }

          containerPlan
            .querySelectorAll(".button-buy-plan")
            .forEach((button) => {
              button.addEventListener("click", function () {
                const planContainer = this.closest(
                  ".container-plan[data-plan-level]"
                );
                if (planContainer) {
                  const planLevel = planContainer.dataset.planLevel;
                  const billingType =
                    planContainer.dataset.priceBillingSelected;

                  emitPlanSelectionEvent(planLevel, billingType);
                  window.location.hash = `planLevel=${planLevel}&billingType=${billingType}`;
                }
              });
            });
        }
      });
    });
}

function applyTranslations(container, lang) {
  if (translations[lang]) {
    container.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.dataset.translate;
      if (translations[lang][key])
        element.textContent = translations[lang][key];
      else
        console.warn(
          `Translation key '${key}' not found in language '${lang}'`
        );
    });
  } else {
    console.error(`Translations for the language: ${lang} not found.`);
  }
}

function emitPlanSelectionEvent(planLevel, billingType) {
  document.dispatchEvent(
    new CustomEvent("pricing-module-plan-selected", {
      detail: { planLevel, billingType },
    })
  );
}

function applyStylesFromModule(container) {
  Object.keys(styles).forEach((key) => {
    const selector = `.${key}`;
    const elements = container.querySelectorAll(selector);
    elements.forEach((element) => {
      element.classList.add(styles[key]);
    });
  });
}
