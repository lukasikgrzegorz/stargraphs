# 🌟 Star Graphs

**Star Graphs** is an interactive web application for generating stylized infographics about movies and Hollywood characters. Users enter a movie name or actor, choose an infographic style, and the system generates a unique, interactive graphical representation of the data.

## ✨ Features

- 🎬 **Infographic Generation** - Create graphics based on movie names, actors, or characters
- 🎨 **Multiple Graphic Styles** - Choose from several visual styles (classic, neon, holo-map)
- 📱 **Responsive Application** - Works perfectly on all devices
- 🔗 **Sharing** - Easy sharing of generated infographics
- 💾 **Download** - Save infographics in various formats
- 🍪 **Privacy** - Application doesn't use cookies and minimizes data collection

## 🧰 Tech Stack

| Layer            | Technology                 |
|------------------|----------------------------|
| **Frontend**     | Next.js 15.3, React 19, TypeScript 5 |
| **Styling**      | Tailwind CSS 4            |
| **Backend**      | Supabase (PostgreSQL)      |
| **Automation**   | n8n                        |
| **Hosting**      | Vercel                     |

## 🚀 Installation and Setup

### Requirements
- Node.js 18.0 or newer
- npm, yarn, pnpm or bun

### Installation Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/your-username/stargraphs.git
   cd stargraphs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
stargraphs/
├── app/                    # Next.js App Router
│   ├── [id]/              # Dynamic infographic pages
│   ├── api/               # API endpoints
│   ├── generate/          # Generator page
│   └── globals.css        # Global styles
├── public/                # Static files
├── styles/                # Additional styles
├── n8n/                   # n8n workflow configuration
│   └── workflow.js        # JSON workflow configuration file
└── .docs/                 # Project documentation
```

## 🎯 How to Use

1. **Homepage** - Browse latest infographics and learn about app capabilities
2. **Generator** - Enter a movie name or actor, choose style and generate infographic
3. **Sharing** - Each infographic has a unique link that can be shared
4. **Download** - Save infographics in PNG or SVG format

## 🛡️ Privacy

Star Graphs follows privacy-first principles:
- **No cookies** - Application doesn't use tracking cookies
- **Minimal data collection** - We collect only essential information
- **No personal data storage** - Data is processed but not stored
- **Transparency** - Clear information about what data is used and why

## 🌟 Examples

Check out example infographics:
- [Star Wars](http://localhost:3000/infographic/star-wars-example)
- [Blade Runner](http://localhost:3000/infographic/blade-runner-example)
- [Matrix](http://localhost:3000/infographic/matrix-example)

## 🤝 Contributing

We welcome any contribution to the project development! Here's how you can help:

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📋 Roadmap

- [ ] Drag & drop editor
- [ ] Color and theme customization
- [ ] Mobile version as PWA
- [ ] Infographic collections
- [ ] Advanced content moderation

---

✨ *Star Graphs is a combination of passion for cinema and design – all in the aesthetics of a distant galaxy…*
