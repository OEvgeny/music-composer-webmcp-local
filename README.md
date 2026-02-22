# WebMCP Demo: Music Composer

This project is a functional demonstration of the [WebMCP Protocol](https://webmcp.link/), illustrating how AI agents can interact with local browser contexts (tools) to achieve complex workflows autonomously.

You can try the live demo for free at: **[https://music.leanmcp.live](https://music.leanmcp.live)**  
*(Note: You must open this link in **[Google Chrome Canary](https://www.google.com/chrome/canary/)** and enable the WebMCP flag in `chrome://flags` for the WebMCP features to work best, otherwise, it'll use a polyfill.)*

## What is WebMCP?

WebMCP (Web Model Context Protocol) is PENDING standard allowing web applications to register "tools" directly with the browser or a connected AI agent. By natively exposing the application's capabilities, an AI can introspect the available tools and intelligently execute tasks. In this specific demo, the agent orchestrates a web-based audio sequencer using nothing but WebMCP tool calls.

To read the official specification, visit [webmcp.link](https://webmcp.link/).

## Local Setup

The default model is **Local / Custom API**, which works with any OpenAI-compatible server (Ollama, LM Studio, etc.) and requires **no LeanMCP account**. A LeanMCP API key is only needed if you want to use the hosted cloud models (GPT-5, Claude, etc.).

### 1. Requirements

- [Node.js](https://nodejs.org/) installed on your machine.
- [Google Chrome Canary](https://www.google.com/chrome/canary/). Experimental WebMCP features are best tested on the bleeding-edge browser.
- **For local models only:** a running OpenAI-compatible server such as [Ollama](https://ollama.com/) or [LM Studio](https://lmstudio.ai/).
- **For cloud models only:** a **LeanMCP API Token**. Get yours from the [LeanMCP API Keys dashboard](https://app.leanmcp.com/api-keys), with adequate credits managed [here](https://app.leanmcp.com/billing).

### 2. Environment Variables (cloud models only)

If you plan to use a hosted cloud model, copy the example environment file and fill in your LeanMCP API token:

```bash
cp .env.example .env
```

Edit `.env` and assign your actual API token:

```env
VITE_GATEWAY_API_KEY=your_actual_leanmcp_api_token_here
```

This step can be skipped entirely if you only intend to use a local model.

### 3. Installation & Running

Install the required npm dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

### 4. Experiencing the Protocol

1. Open **Google Chrome Canary**.
2. Navigate to `chrome://flags` and enable the **WebMCP** experimental feature. Relaunch the browser if prompted.
3. Navigate to the `localhost` URL provided by the Vite server (typically `http://localhost:5173`).
4. The **Local / Custom API** option is pre-selected. Fill in your local server endpoint and model name, then click **Start Agent**.
5. To use a hosted cloud model instead, select it from the model dropdown (a LeanMCP account is required) and click **Start Agent**.

## Local Model Support

You can run the composer against any **OpenAI-compatible** local model server (Ollama, LM Studio, vLLM, etc.) without needing a LeanMCP API key.

### Using a local model

1. In the **Model** dropdown, select **Local / Custom API**.
2. Fill in the three fields that appear:
   - **Endpoint URL** — base URL of your local server, e.g. `http://localhost:11434`
   - **API Key** — leave blank if your server does not require one
   - **Model Name** — the model identifier your server expects, e.g. `llama3`, `mistral`, `gemma3`
3. Click **Start Agent**.

Settings are saved in `localStorage` and persist across page reloads.

### CORS and the built-in proxy

Browsers block direct requests to `localhost` from a page served on a different origin. If your local model server does not send CORS headers, use the included proxy:

```bash
npm run proxy -- http://localhost:11434
```

The proxy starts on `http://localhost:3033`, forwards every request to the target URL, and injects the required CORS headers. Once it is running, set the **Endpoint URL** in the app to:

```
http://localhost:3033
```

You can point the proxy at any base URL:

```bash
# Ollama (default port)
npm run proxy -- http://localhost:11434

# LM Studio (default port)
npm run proxy -- http://localhost:1234

# vLLM or any other OpenAI-compatible server
npm run proxy -- http://localhost:8000
```

The proxy uses only Node.js built-in modules — no extra dependencies are required.
