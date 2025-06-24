# StarGraphs – Technical Description of UI-N8N Workflow

## General Description

Users fill out a form on the website, entering:

* query (e.g., person's name or movie title),
* style selection (template_id).

A unique identifier `id` is automatically assigned, and then the data is sent to automation in **n8n** via webhook. The workflow handles query analysis, classification, data retrieval from TMDB and Wikipedia, content generation, and status updates in the **Supabase** database.

## Infographic Statuses

Each infographic in the database can have one of the following statuses:

* `STARTED` – generation started
* `NOCATEGORY` – query doesn't match person or movie
* `PERSONNOTFOUND` – person not found
* `MOVIENOTFOUND` – movie not found
* `READY` – generation completed
* `ERROR` – error occurred

---

## Workflow Steps

### 1. Incoming Webhook

* Node: **Webhook**
* Expects data: `id`, `query`, `template_id`
* Triggers workflow

### 2. Query Analysis and Improvement

* Node: **Improving query content** (Gemini)
* Function: checking query correctness, correcting typos and formatting
* Examples: "star wars" → "Star Wars", "petro pascal" → "Pedro Pascal"

### 3. Initial Save to Supabase

* Node: **Saving initial information to the database**
* Initial status: `STARTED`
* Saves improved user query

### 4. Query Classification

* Node: **Classifier** (Gemini)
* Prompt: classification as `PERSON`, `TITLE`, or `SPAM`
* Result passed to **Switch**

### 5. Classification Result Handling (Switch)

* `PERSON` → query concerns a person
* `TITLE` → query concerns a movie
* `SPAM` → end workflow and set status `NOCATEGORY` through **Update status if the query is SPAM**

### 6. Data Retrieval from TMDB

#### a) For Persons

* Node: **Person data from TMDB**
* Check number of results (**If1**)
* If `total_results > 0`: continue to filtering
* If no results: set status `PERSONNOTFOUND` through **Update status if person not found**

#### b) For Movies

* Node: **Movie data from TMDB**
* Check number of results (**If**)
* If `total_results > 0`: continue to filtering
* If no results: set status `MOVIENOTFOUND` through **Update status if video not found**

### 7. Data Filtering and Enhancement

#### a) For Persons

* Node: **Filtering people by popularity**
* Sort results by popularity and select the most popular person
* Node: **Person data from Wiki**
* Retrieve additional information from Wikipedia
* Node: **Combining person data**
* Combine TMDB and Wikipedia data into one JSON object

#### b) For Movies

* Node: **Filtering movies by popularity**
* Sort results by popularity and select the most popular movie
* Node: **Reading movie genres**
* Map genre IDs to text names
* Node: **Movie data from Wiki**
* Retrieve additional information from Wikipedia
* Node: **Combining movie data**
* Combine TMDB and Wikipedia data into one JSON object

### 8. Template Retrieval from Supabase

* Node: **Download template data for person** (for persons)
* Node: **Download template data for movie** (for movies)
* Retrieve template based on `template_id`

### 9. Infographic Content Construction

#### a) For Persons

* Node: **Construction of template content for person** (Gemini)
* Input data: combined person data from TMDB/Wikipedia and template
* Generate content in English with 14+ components

#### b) For Movies

* Node: **Construction of template content for movie** (Gemini)
* Input data: combined movie data from TMDB/Wikipedia and template
* Generate content in English with 14+ components

### 10. Save Completed Infographic

* Node: **Saving the content of the infographic for person** (for persons)
* Node: **Saving the content of the infographic for movie** (for movies)
* Content (`content`) and status `READY`

---

## Next.js Application - Frontend

### Infographic Status Monitoring

The Next.js application automatically listens for infographic status changes in the Supabase database:

* **Real-time subscriptions** – using Supabase real-time to track status changes
* **Dynamic messages** – appropriate messages displayed to users based on current status:
  * `STARTED` – "Generating your infographic..."
  * `NOCATEGORY` – "Cannot classify query"
  * `PERSONNOTFOUND` – "Person not found"
  * `MOVIENOTFOUND` – "Movie not found"
  * `READY` – redirect to completed infographic
  * `ERROR` – error occurred

### Infographic Display

* **Content retrieval** – application fetches generated content (`content`) from Supabase database
* **Component rendering** – JSON content is transformed into interactive React components
* **Responsive design** – infographics adapt to different screen sizes

---

## PNG File Generation

### Node.js API with Puppeteer

A separate Node.js API is used to generate PNG files from interactive infographics:

#### Generation Process

1. **Request reception** – API receives infographic ID
2. **Puppeteer launch** – headless Chrome browser
3. **Page navigation** – navigate to infographic URL in Next.js application
4. **Load waiting** – full rendering of all components
5. **Screenshot** – capture entire page
6. **Image editing** – crop footer and unnecessary elements
7. **File return** – deliver ready PNG to user

#### Advantages of This Approach

* **Style preservation** – all CSS and Tailwind styles are accurately reproduced
* **Interactive elements** – even animations and transitions are properly rendered
* **Visual consistency** – PNG looks identical to the web page
* **Automatic responsiveness** – ability to generate in different resolutions

---

## AI Role in StarGraphs Process

### AI Models and Performance

**Primary Model: Gemini 2.0 Flash**

* **Cost efficiency** – infographic generation cost < $0.01
* **High quality** – advanced reasoning and content generation capabilities
* **API stability** – reliable Google Cloud infrastructure

**Local Model Support**

The system supports integration with local AI models for enhanced privacy and cost control:

* **Gemma 3** – Google's open-source model for local deployment
* **Custom fine-tuned models** – possibility to train specialized models for film industry content
* **Hybrid approach** – combining cloud and local models based on requirements
* **Cost optimization** – local models for high-volume processing
* **Privacy enhancement** – sensitive data processing without external API calls

### 1. User Query Improvement

**Node: Improving query content (Gemini 2.0 Flash)**

* **Typo correction** – automatic spelling error correction
* **Format standardization** – unifying proper noun spelling
* **User error elimination** – fixing common mistakes in names
* **Search optimization** – transforming query into best form for searching

**Transformation examples:**
* "star wars" → "Star Wars"
* "petro pascal" → "Pedro Pascal"
* "avengers endgame" → "Avengers: Endgame"
* "christopher nolan" → "Christopher Nolan"

### 2. Query Classification

**Node: Classifier (Gemini 2.0 Flash)**

* **Category recognition** – determining if query concerns person, movie, or is spam
* **Content filtering** – eliminating inappropriate or off-topic queries
* **Workflow routing** – selecting appropriate processing path based on classification

**Categories:**
* `PERSON` – query concerns actor, director, or other film industry person
* `TITLE` – query concerns movie, series, or production
* `SPAM` – query is not related to movies or persons

### 3. Infographic Content Construction

**Nodes: Construction of template content (Gemini 2.0 Flash)**

* **Data analysis** – processing complex information from TMDB and Wikipedia
* **Component matching** – intelligent selection of most interesting facts
* **Content generation** – creating attractive descriptions and headlines
* **Information structuring** – organizing content according to infographic template

**Creation process:**
1. **Available data analysis** – evaluating all information from APIs
2. **Fact selection** – choosing most interesting and current information
3. **Content generation** – creating descriptions adapted to components
4. **Length optimization** – adapting texts to layout constraints
5. **Quality control** – ensuring minimum 14 components in infographic

---

## StarGraphs Project Values

### Privacy and Data Minimalism

* **Minimum data** – we collect only essential information needed for infographic generation
* **No cookies** – we don't store tracking cookies for users
* **Privacy respect** – we don't store personal data

### Balance Between AI and Programming

* **Programming First** – priority for programmatic solutions before using AI
* **Automation** – everything that can be automated programmatically doesn't require AI
* **Cost control** – limiting costs through thoughtful use of AI only where needed
* **Hallucination reduction** – lower risk of AI errors through structural programmatic solutions

### Technology Accessibility

* **N8N as broker** – visual workflows enable understanding of processes by non-technical people
* **Automation democratization** – anyone can create and modify processes without code knowledge
* **Process transparency** – all steps are visible and editable in graphical interface
* **Easy expansion** – adding new features through drag-and-drop nodes

### Copyright Respect

* **Open APIs** – we use only legal and official data sources
* **No scraping** – we don't retrieve data directly from websites
* **Terms compliance** – we follow TMDB and Wikipedia API terms of use
* **Ethical AI** – content generation based on publicly available data

---

## Used Technologies

* **n8n** – workflow automation
* **Supabase** – database and real-time subscriptions
* **Next.js** – frontend application with Server Components
* **TMDB API** – movie and person data
* **Wikipedia API** – additional biographical and film information
* **Gemini 2.0 Flash (Google)** – ultra-fast LLM for query analysis, classification, and content generation
* **Gemma 3** – optional local model for enhanced privacy and cost control
* **Node.js API** – PNG generation service
* **Puppeteer** – headless browser for screenshots

---

## Final Notes

The workflow is modular and can easily be expanded with additional data sources or other classification types. The status system in Supabase database facilitates monitoring and error diagnosis in infographic generation. The introduced improvements significantly enhance the quality of generated content through better query analysis and data enrichment from multiple sources.
