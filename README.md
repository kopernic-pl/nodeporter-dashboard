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

## 🚦 How to Run/Use

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

You can deploy NodePorter to your Kubernetes cluster using the published Helm chart from the GitHub Container Registry (GHCR).

#### Prerequisites

- Helm 3.x installed ([installation guide](https://helm.sh/docs/intro/install/))
- Access to a Kubernetes cluster (e.g., minikube, kind, k3s, or remote)

#### 1. Add the OCI Registry (one time)

```sh
helm registry login ghcr.io
```

#### 2. Install the Chart

Check for the latest version on [GHCR NodePorter Helm Chart](https://github.com/orgs/kopernic-pl/packages/container/package/charts%2Fnodeporter).

```sh
helm install nodeporter oci://ghcr.io/kopernic-pl/charts/nodeporter \
  --version <latest-version> \
  --set service.type=NodePort \
  --set service.nodePort=30080 # Optional: set a specific NodePort
```

- By default, the app will be available on the assigned NodePort of your cluster nodes.
- You can override any value from the chart using `--set key=value` or by providing a custom `values.yaml` with `-f values.yaml`.

#### 3. Upgrade

To upgrade to a new version:

```sh
helm upgrade nodeporter oci://ghcr.io/kopernic-pl/charts/nodeporter \
  --version <latest-version>
```

#### 4. Uninstall

To remove the deployment:

```sh
helm uninstall nodeporter
```

#### 5. Customization

- See the chart's default values ([values.yaml](https://github.com/kopernic-pl/nodeporter/blob/main/charts/nodeporter/values.yaml)) for configuration options (replica count, resources, etc).
- Example: Change service type to `ClusterIP` or set resource limits.

For more, see the [Helm documentation](https://helm.sh/docs/).

---

## 🧑‍💻 Getting Started with Dev

### Dev prerequisites

- Node.js v18+ (tested on v22)
- Access to a Kubernetes cluster (local or remote)

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
