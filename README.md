# WebWave - Pricing

WebWave - Pricing to projekt strony internetowej prezentującej plany cenowe z różnymi opcjami rozliczeń. Strona wykorzystuje dynamiczne elementy, takie jak tooltipy i przełączniki cenowe.

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

3. Uruchom lokalny serwer developerski:

   ```bash
   npm start
   ```

4. Zbuduj projekt:

   ```bash
   npm run build
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

- **Przełączanie Wyświetlania Cen**: Użytkownicy mogą przełączać się między miesięcznymi a rocznymi planami cenowymi.
- **Tooltipy**: Informacje dostępne są przez tooltipy na ikonach informacji.
- **Interaktywne Przycisk Wybierający Plan**: Kliknięcie w przycisk "Wybierz" wyświetla alert z potwierdzeniem wybranego planu.

## Zmienne i Konfiguracja

- Dynamiczne dodawanie parametrów do URL obsługiwane przez JavaScript.

## Sposób integracji

Projekt jest skonfigurowany do tworzenia modułu, który można zintegrować na innej stronie. Skompilowany plik znajdziesz w katalogu `dist`.

### Integracja w HTML

Aby zintegrować tabelę ceny z inną stroną, wstaw poniższy kod do swojego dokumentu HTML:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moduł Cennika</title>
</head>
<body>
    <!-- Kontener, w którym będzie osadzona tabela cenowa -->
    <div id="pricingTable"></div>

    <!-- Osadzenie skryptu modułu -->
    <script src="path/to/pricingModule.bundle.js"></script>
    <script>
      PricingModule.initPricingTable('pricingTable');
    </script>
</body>
</html>
```

## Przyszłe Plany

- Integracja z backendem w celu obsługi rzeczywistych transakcji zakupu.
- Rozszerzenie na więcej planów i wersji językowych.

## Wkład

Jesteśmy otwarci na sugestie i wkład. Jeśli chcesz dodać coś do projektu, otwórz zgłoszenie (issue) lub zrób pull request.