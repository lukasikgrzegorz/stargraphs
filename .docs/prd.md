# 📄 Dokument Wymagań Produktu (PRD) – **Star Graphs**

## 1. 🪐 Przegląd produktu

**Star Graphs** to interaktywna aplikacja webowa do generowania stylizowanych infografik o filmach i postaciach ze świata Hollywood. Użytkownik wprowadza nazwę filmu lub aktora oraz wybiera styl infografiki, a system generuje unikalną, interaktywną graficzną reprezentację danych.

Technologia opiera się na:
- **Frontend**: [Next.js](https://https://nextjs.org/) + JavaScript,
- **Backend**: [Supabase](https://supabase.com/) + [n8n](https://n8n.io/) (automatyzacja),
- Styl: motywy nawiązujące do estetyki kosmicznej i retro-futurystycznej.

---

## 2. 🚀 Problem użytkownika

Użytkownicy chcą szybko i efektownie zaprezentować informacje o aktorach, filmach lub seriach filmowych. Brakuje jednak łatwego narzędzia, które pozwalałoby wygenerować atrakcyjną wizualnie infografikę bez konieczności użycia zaawansowanego oprogramowania graficznego.

---

## 3. 🧩 Zakres funkcjonalny

### 🖥️ Strona główna
- Tytuł aplikacji i krótki opis jej działania.
- Hero image/animacja inspirowana Star Wars.
- Sekcja z **3 najnowszymi infografikami** (miniatury + link).
- Kreatywna stopka z linkami (GitHub, kontakt, o projekcie).

### 🎛️ Generator infografik
- Formularz z polami:
  - `Fraza` – nazwa filmu, aktora, postaci,
  - `Styl graficzny` – np. klasyczny, neonowy, holo-mapowy.
- Przycisk `Generuj infografikę`.
- Po przesłaniu – przekierowanie do unikalnej strony wygenerowanej infografiki.

### 🌌 Strona infografiki
- Dynamiczne ładowanie danych na podstawie ID/hash.
- Widok infografiki z możliwością:
  - Pobrania grafiki (PNG/SVG),
  - Udostępnienia linku (social media)
---

## 4. 🧪 Technologia

| Warstwa     | Technologia                |
|-------------|----------------------------|
| Frontend    | Next.js + JavaScript         |
| Styling     | TailwindCSS (kosmiczna estetyka) |
| Backend     | Supabase (baza danych, storage) |
| Automatyzacja | n8n (API, generowanie danych, integracje z LLM) |

---

## 5. 🛑 Granice MVP

MVP **nie zawiera**:
- Rejestracji/logowania użytkowników,
- Edytora typu drag & drop,
- Personalizacji kolorów/motywów,
- Płatności ani wersji mobilnej/PWA,
- Zaawansowanej moderacji treści.

---

## 6. 👤 Historyjki użytkowników (User Stories)

### US-001 – Strona główna
**Jako** użytkownik odwiedzający stronę,  
**chcę** zobaczyć przykład działania aplikacji,  
**aby** zrozumieć jej funkcjonalność i przejść do generatora.

**Kryteria akceptacji**:
- Widoczny nagłówek z misją projektu,
- Sekcja 3 najnowszych infografik (miniatury z linkiem),
- Stylizacja nawiązująca do Star Wars,
- Link do generatora.

---

### US-002 – Generator infografik
**Jako** użytkownik zainteresowany filmem lub aktorem,  
**chcę** wpisać frazę i wygenerować infografikę,  
**aby** otrzymać wizualną reprezentację danych.

**Kryteria akceptacji**:
- Formularz umożliwia podanie frazy, typu, stylu,
- Przycisk generuje zapytanie i zapisuje wynik w Supabase,
- Przekierowanie na unikalną stronę z infografiką.

---

### US-003 – Strona infografiki
**Jako** użytkownik,  
**chcę** zobaczyć infografikę w estetycznej formie,  
**aby** móc ją pobrać lub udostępnić znajomym.

**Kryteria akceptacji**:
- Infografika ładowana dynamicznie z Supabase,
- Widoczny przycisk pobierania i udostępniania,
- Sekcja z propozycjami podobnych infografik.

---

## 7. 📊 Metryki sukcesu

- **≥ 70%** użytkowników generuje min. 1 infografikę.
- **≥ 50%** infografik jest udostępnianych lub pobieranych.
- **≤ 10 sekund** – średni czas wygenerowania grafiki.
- **≥ 90%** zapytań zakończonych sukcesem (bez błędów).
- **≥ 4/5** – średnia ocena UI i stylizacji w feedbacku.

---

## 8. 🔭 Dalszy rozwój (po MVP)
- Logowanie i historia użytkownika,
- Własna edycja kolorów i stylu graficznego,
- Wersja mobilna jako PWA,
- Możliwość zapisania zestawień (kolekcji infografik),
- API do generowania grafik zewnętrznie.

---

> ✨ *Star Graphs to połączenie pasji do kina i designu – wszystko w estetyce odległej galaktyki…*