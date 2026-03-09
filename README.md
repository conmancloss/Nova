<div align="center">

```
 ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ 
 ████╗  ██║██╔═══██╗██║   ██║██╔══██╗
 ██╔██╗ ██║██║   ██║██║   ██║███████║
 ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║
 ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║
 ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝
```

**A fast, clean web proxy powered by Scramjet**

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)
![Scramjet](https://img.shields.io/badge/Scramjet-2.0.0--alpha-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</div>

---

## ✨ Features

- 🚀 **Fast proxying** via [Scramjet](https://github.com/MercuryWorkshop/scramjet)
- 🎮 **70+ games** loaded dynamically from `games.json`
- 🌐 **Browse any site** through the built-in proxy
- 🔒 **Wisp transport** for WebSocket support
- 📦 **Clean structure** — static UI separated from proxy engine

---

## 📁 Project Structure

```
Nova/
├── static/          # UI files (index.html, games.json, sw.js, etc.)
│   ├── index.html   # Main frontend
│   ├── games.json   # Game list — edit this to add/remove games
│   ├── config.js    # Scramjet config
│   └── sw.js        # Service worker
│
└── scramjet/        # Proxy engine
    ├── server.js    # Node.js server
    ├── src/         # Scramjet source
    ├── dist/        # Built JS files
    └── rewriter/    # WASM rewriter
```

---

## 🚀 Running Locally

```bash
# Install dependencies
cd scramjet
pnpm install --ignore-scripts

# Start the server
pnpm dev
```

Then open **http://localhost:1337**

---

## ➕ Adding Games

Edit `static/games.json` and add an entry:

```json
{
  "name": "My Game",
  "url": "https://example.com/game",
  "image": "https://example.com/icon.png"
}
```

No need to touch `index.html` — the games page loads dynamically.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Scramjet](https://github.com/MercuryWorkshop/scramjet) | Core proxy engine |
| [Fastify](https://fastify.dev) | HTTP server |
| [Wisp](https://github.com/MercuryWorkshop/wisp-js) | WebSocket transport |
| [Bare Server](https://github.com/nicholasstephan/bare-server-node) | Bare transport |
| WebAssembly | JS rewriting |

---

## ⚠️ Disclaimer

Nova is intended for educational purposes. Use responsibly.

---

<div align="center">
  Made with 🔥 by conmancloss
</div>
