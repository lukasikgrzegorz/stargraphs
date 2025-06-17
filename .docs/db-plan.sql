Struktura obejmuje dwie główne tabele:
1. templates – przechowuje wzorce infografik w formacie HTML z placeholderami.
2. infographics – przechowuje wygenerowane strony na podstawie zapytań użytkowników i wybranych szablonów.

Dlaczego tak?

- Szablony HTML są wielokrotnie wykorzystywane, dlatego oddzielamy je od danych dynamicznych.
- Każda infografika powstaje na bazie konkretnego zapytania i szablonu – to pozwala zbudować system oparty o dziedziczenie i elastyczność stylów.
- Używamy UUID jako kluczy głównych – są bezpieczne do publicznego użytku w URL-ach i dobrze wspierane przez Supabase.
- Pola `content` przechowują HTML – zarówno z placeholderami (`templates`), jak i z danymi (`infographics`).
- Pole `user_query` przechowuje to, co użytkownik wpisał – np. „Tom Hanks” albo „Matrix 1999”.
- Pole `created_at` pozwala nam śledzić historię użycia i wygenerować np. listę najnowszych infografik.

Przykładowe użycie:
- Użytkownik wybiera styl "galaktyczny" → aplikacja pobiera odpowiedni szablon.
- Wprowadza zapytanie: „Leonardo DiCaprio”.
- n8n i Supabase uzupełniają placeholdery w szablonie → tworzą gotowy HTML.
- Wynik zapisywany jest w `infographics`, a użytkownik otrzymuje unikalny link do swojej strony.

To podejście zapewnia:
- Łatwe dodawanie nowych szablonów bez modyfikowania kodu backendu,
- Możliwość wersjonowania infografik,
- Skalowalność i prostotę analizy danych.

*/

-- Tabela szablonów infografik
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- HTML z placeholderami np. {{actor}}, {{movie}}, {{data}}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela wygenerowanych infografik
CREATE TABLE infographics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_query TEXT NOT NULL,             -- np. "Leonardo DiCaprio", "Interstellar"
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    content TEXT NOT NULL,                -- Wygenerowany HTML z wypełnionymi placeholderami
    generation_status TEXT NOT NULL,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);