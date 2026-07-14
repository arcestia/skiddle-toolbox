# Developer Toolbox - Cloudflare Pages Hub

A premium developer portal and tools suite hosted at the edge using Cloudflare Pages.

When visiting the root URL `/`, users see a central tools menu listing all utility tools. Clicking on a tool redirects them to its dedicated route.

---

## 📂 Project Directory Structure

```
├── functions/               # Cloudflare Pages Functions
│   └── api/
│       └── cors.js          # Pages CORS proxy function (used for image validation)
├── .gitignore               # Excludes dev caches and node_modules
├── index.html               # Central tools menu portal
├── cdn-validator.html       # Standalone Image CDN Validator utility (/cdn-validator)
├── package.json             # NPM build scripts
└── wrangler.toml            # Wrangler configuration for Cloudflare Pages
```

---

## 🛠️ Getting Started (Local Development)

To run the project locally, install dependencies and start the Wrangler development server.

### Installation
```bash
npm install
```

### Run Local Development Server
Launch the static pages alongside the CORS proxy function locally on port `8788`:
```bash
npm run dev
```
Open [http://localhost:8788](http://localhost:8788) in your browser. The main menu will load, and clicking the **Image CDN Validator** card will redirect you to `/cdn-validator` (`cdn-validator.html`).

---

## 🐙 Git & GitHub Repository Setup

Since the initial commit has been created, you can create a remote repository and push your code to GitHub.

### 1. Create a GitHub Repository (via GitHub CLI)
To create a repository on your active GitHub account:
```bash
gh repo create workers-toolbox --public --source=. --remote=origin
```

### 2. Push to GitHub
Rename your default branch to `main` (if not already done) and push your initial commit:
```bash
git branch -M main
git push -u origin main
```

---

## 🚀 Deploying to Cloudflare Pages

### Deploy manually via Wrangler CLI
Deploy the project directly to Cloudflare Pages:
```bash
npm run deploy
```
Cloudflare Pages supports Clean URLs automatically. For example, `cdn-validator.html` will be resolved dynamically at the route `/cdn-validator` without showing the `.html` extension.

### Deploy automatically via Git Integration
Alternatively, you can link your GitHub repository to Cloudflare Pages in the Cloudflare Dashboard to enable automatic deployments on every `git push`.
