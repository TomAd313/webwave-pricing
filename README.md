# WebWave - Pricing

WebWave - Pricing to projekt strony internetowej, który umożliwia użytkownikom przeglądanie i wybieranie planów cenowych z różnymi opcjami rozliczeń. Strona zawiera dynamiczne elementy, takie jak tooltipy i przełączniki cenowe.

## Technologie

- HTML5
- CSS3 (SCSS)
- JavaScript (ES6)
- [Bootstrap](https://getbootstrap.com/)
- [Webpack](https://webpack.js.org/)

## Instalacja

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/yourusername/webwave-pricing.git
   cd webwave-pricing
   ```

2. Zainstaluj wymagane zależności za pomocą npm:

   ```bash
   npm install
   ```

3. Uruchom projekt lokalnie:

   ```bash
   npm start
   ```

## Struktura projektu

```
webwave-pricing/
├── dist/                # Pliki produkcyjne
├── src/                 # Pliki źródłowe
│   ├── js/              # Kod źródłowy JavaScript
│   ├── scss/            # Pliki styli SCSS
│   └── index.html       # Główny plik HTML
├── package.json         # Plik z zależnościami npm
├── webpack.config.js    # Konfiguracja Webpacka
└── README.md            # Dokumentacja projektu
```

## Funkcjonalności

- **Przełączanie Wyświetlania Cen**: Użytkownicy mogą przełączać się między miesięcznymi a rocznymi planami za pomocą checkboxa `Miesięczne/Roczne`.
- **Tooltipy**: Informacje dostępne są przez tooltipy na ikonach informacji.
- **Interaktywne Przycisk Wybierające Plan**: Kliknięcie w przycisk "Wybierz" pokazuje alert z potwierdzeniem wybranego planu.

## Zmienne i Konfiguracja

- Dynamiczne dodawanie parametrów do URL obsługiwane przez JavaScript:
  ```javascript
  function appendParamsToUrl(url, params) {
    // Kod obsługujący dodawanie parametrów
  }
  ```
- Przykład użycia tej funkcji dostępny jest w pliku JS.

## Przyszłe Plany

- Integracja z backendem w celu obsługi rzeczywistych transakcji zakupu.
- Rozszerzenie na więcej planów i wersji językowych.

## Wkład

Jesteśmy otwarci na sugestie i wkład. Jeśli chcesz dodać coś do projektu, otwórz zgłoszenie (issue) lub zrób pull request.

## Kontakt

- Autor: Tomasz Adamiak
- Email: [email@example.com](mailto:email@example.com)