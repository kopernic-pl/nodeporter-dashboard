# NodePorter

![App Screenshot](./app-screenshot.png)
 Kubernetes Services Dashboard

A dashboard for viewing your local home lab Kubernetes cluster networking—**no hosts file editing or custom DNS required!**

---

> **Note:** This project was created and iteratively developed using AI assistance, enabling rapid prototyping and high-quality automation.

---

## 🚀 Project Background

This project was conceived as an experiment to leverage generative AI (GenAI) for real-world software development, while also solving a common pain point for home lab Kubernetes users:

> **How can I remember Kubernetes services nodeports, without editing `/etc/hosts` or running my own DNS for ingress?**

NodePorter provides a user-friendly, retro≥-styled dashboard that discovers and displays all your cluster services (and some nodes data), making it easy to remember and access NodePorts, and more—all with zero manual networking hacks.

---

## ✨ Features

- **Environment-aware banner:** Instantly see if you’re running in-cluster or local/dev mode.
- **Kubernetes Service Table:** List all services, types, ports, and direct NodePort links.
- **Cluster Node Summary:** See node count, total CPU, and memory at a glance.
- **No hosts file or DNS hacks:** Access services using real node IPs—no manual setup required.
- **Retro UI:** Styled with 8-bit fonts and vibrant colors for fun and clarity.
- **AI-assisted development:** The codebase was built and refactored with the help of generative AI tools for rapid iteration.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v18+ (tested on v22)
- Access to a Kubernetes cluster (local or remote)

### Running locally

```sh
npm install
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running container

```sh
docker run -d -p 3000:3000 ghcr.io/kopernic-pl/nodeporter-dashboard
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running with Helm

tbd...

---

## 🏡 Home Lab Use Case

- Deploy this dashboard to your local cluster (e.g., k3s, kind, minikube).
- No need to edit `/etc/hosts` or run CoreDNS tweaks—just use the NodePort links provided.
- Works great for small teams or home labs wanting simple services and cluster size overview.

---

## 🤖 GenAI Approach

This project was iteratively built and improved using generative AI (Cascade, GPT-4, etc.), showcasing:

- Rapid prototyping of UI and API features
- Automated code refactoring and dependency management
- AI-driven troubleshooting and test creation

---

## 📦 Project Structure

- `.github/` - GitHub configuration and workflows
- `ops/` — Deployment and Dockerization scripts
- `pages/` — Next.js pages and API routes (including `api/` for backend endpoints)
- `public/` — Static assets (icons, manifest, etc.)
- `styles/` — Global and component CSS
- `utils/` — Utility/helper functions (e.g., logging)
- `__tests__/` — Jest tests for API and frontend


---

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [@kubernetes/client-node](https://github.com/kubernetes-client/javascript)
- [styled-components](https://styled-components.com/)
- [@fontsource/press-start-2p](https://fontsource.org/fonts/press-start-2p)
- GenAI for development support

---

## 📝 License

MIT—with a cookie twist 🍪
