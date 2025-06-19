# StarGraphs – Opis Workflow UI/N8N

## Opis ogólny

Użytkownik wypełnia formularz na stronie internetowej, wprowadzając:

* zapytanie (np. imię nazwisko osoby lub tytuł filmu),
* wybór stylu (template\_id).

Automatycznie nadawany jest unikalny identyfikator `id`, po czym dane są przesyłane do automatyzacji w **n8n** poprzez webhook. Workflow obsługuje klasyfikację zapytania, pobieranie danych z TMDB, generowanie treści i aktualizację statusów w bazie danych **Supabase**.

## Statusy infografiki

Każda infografika w bazie może mieć jeden z poniższych statusów:

* `STARTED` – rozpoczęto generowanie
* `NOCATEGORY` – zapytanie nie pasuje do osoby ani filmu
* `PERSONNOTFOUND` – nie znaleziono takiej osoby
* `MOVIENOTFOUND` – nie znaleziono takiego filmu
* `READY` – ukończono generowanie

---

## Kroki workflow

### 1. Webhook wejściowy

* Node: **Webhook**
* Oczekuje danych: `id`, `query`, `template_id`
* Triggeruje workflow

### 2. Zapis wstępny do Supabase

* Node: **Zapis do bazy wstępnych informacji**
* Status początkowy: `STARTED`

### 3. Klasyfikacja zapytania

* Node: **Klasyfikator** (Gemini)
* Prompt: klasyfikacja jako `PERSON`, `TITLE` lub `SPAM`
* Wynik przekazywany do **Switch**

### 4. Obsługa wyniku klasyfikacji (Switch)

* `PERSON` → zapytanie dotyczy osoby
* `TITLE` → zapytanie dotyczy filmu
* `SPAM` → zakończ workflow i ustaw status `NOCATEGORY`

### 5. Pobranie danych z TMDB

#### a) Dla osób

* Node: **Dane o osobie z TMDB**
* Sprawdzenie liczby wyników (`If1`)
* Jeśli `total_results > 0`: kontynuuj
* Jeśli brak wyników: ustaw status `PERSONNOTFOUND`

#### b) Dla filmów

* Node: **Dane o filmie z TMDB**
* Sprawdzenie liczby wyników (`If`)
* Jeśli `total_results > 0`: kontynuuj
* Jeśli brak wyników: ustaw status `MOVIENOTFOUND`

### 6. Pobranie szablonu z Supabase

* Node: **Pobranie danych szablonu** na podstawie `template_id`

### 7. Budowa treści infografiki

* Node: **Budowa treści szablonu** (Gemini)
* Dane wejściowe: JSON z TMDB i szablon z Supabase
* Prompt: Podstaw dane do szablonu, bez dodatkowych komentarzy

### 8. Zapis gotowej infografiki

* Node: **Zapisanie infografiki w bazie**
* Treść (`content`) oraz status `READY`

---

## Użyte technologie

* **n8n** – workflow automation
* **Supabase** – baza danych
* **TMDB API** – dane o filmach i osobach
* **Gemini (Google)** – LLM do klasyfikacji i generowania treści

---

## Uwagi końcowe

Workflow jest modularny i może być łatwo rozbudowany o dodatkowe źródła danych lub inne typy klasyfikacji. System statusów w bazie Supabase ułatwia monitoring i diagnostykę błędów w generacji infografik.
