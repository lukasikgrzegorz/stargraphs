# 🧰 Tech Stack – Star Graphs

Projekt **Star Graphs** to aplikacja webowa służąca do generowania infografik związanych z filmami, aktorami i motywami popkulturowymi. Poniżej znajduje się opis stosu technologicznego wykorzystywanego w projekcie.

---

## 🌐 Frontend

| Technologia     | Opis                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Next.js**    | Framework do tworzenia statycznych i hybrydowych aplikacji frontendowych. Umożliwia szybką, modularną budowę stron z SSR/SSG. Idealny do serwisów z infografikami. |
| **Tailwind CSS**| Narzędziowa biblioteka CSS umożliwiająca szybkie i responsywne stylowanie komponentów. Dzięki niej łatwo nawiązać do stylu retro/futurystycznego (Star Wars vibe). |

---

## 🧠 Backend & Logika Aplikacji

| Technologia     | Opis                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Node.js**     | Środowisko uruchomieniowe JavaScript do budowy backendu aplikacji – odpowiedzialne za generowanie infografik, integrację z bazą danych, przetwarzanie zapytań. |
| **n8n**         | Low-code workflow automation – wykorzystywane do integracji, przetwarzania danych (np. generowanie HTML z szablonów) i automatyzacji zadań. |

---

## 💾 Baza danych

| Komponent       | Opis                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Supabase DB** | Hostowana baza PostgreSQL – bezpośrednie zapytania SQL, trigger-y, obsługa UUID, obsługa plików i autoryzacji. |
| **Supabase Storage (opcjonalnie)** | Możliwe przechowywanie wygenerowanych infografik jako statyczne pliki HTML. |

---

## 🔗 Inne narzędzia

| Narzędzie       | Opis                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Git + GitHub**| Zarządzanie kodem źródłowym i współpracą zespołową.                  |
| **ESLint + Prettier** | Lintowanie i automatyczne formatowanie kodu JS/TS.              |

---

## 🎯 Podsumowanie

| Warstwa          | Technologia                |
|------------------|----------------------------|
| Frontend         | Next.js, Tailwind CSS     |
| Backend          | Node.js, n8n               |
| Baza danych      | Supabase (PostgreSQL)      |
| Automatyzacja    | n8n                        |
| Styl graficzny   | Motyw inspirowany Star Wars|

---

> 📌 Uwaga: Cały projekt jest projektowany jako lekka aplikacja statyczna z dynamicznie generowanymi stronami infografik i możliwością ich łatwego udostępniania (np. `/infographic/:id`).

