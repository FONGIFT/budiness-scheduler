# BookFlow Scheduler

BookFlow Scheduler is a Vite, React, and TypeScript web application for managing
appointments, services, availability, and customers.

## Run locally on Windows (isolated environment)

This is a Node.js application. Rather than installing its packages globally, the
steps below create a project-local Node.js environment with
[nodeenv](https://github.com/ekalinin/nodeenv), then install the application's
dependencies into the project's `node_modules` folder. This keeps both Python
tools and Node.js dependencies isolated from the rest of your Windows computer.

### Prerequisites

- **Git for Windows**, to clone the repository.
- **Python 3.10 or newer**, including `pip`. Verify it with `py --version`.
- Internet access the first time you create the environment and install packages.

> **Why Python?** `nodeenv` uses Python only to create an isolated Node.js
> runtime. The application itself is written in TypeScript and runs on Node.js.

### 1. Open PowerShell and get the project

If you have not cloned the project yet, run:

```powershell
git clone <repository-url> bookflow-scheduler
cd bookflow-scheduler
```

If you already have the project, open PowerShell in its folder instead:

```powershell
cd C:\path\to\budiness-scheduler
```

### 2. Create and activate the virtual environment

Create a Python virtual environment for the environment-management tool, then
install `nodeenv` inside it:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip nodeenv
```

If PowerShell reports that script execution is disabled, allow scripts for the
current PowerShell window only, then activate the environment again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 3. Create an isolated Node.js runtime

Use `nodeenv` to download Node.js 22 into a project-local `.nodeenv` directory
and activate it:

```powershell
nodeenv --node=22.14.0 .nodeenv
.\.nodeenv\Scripts\Activate.ps1
node --version
npm --version
```

The final two commands should print version numbers. Keep both `.venv` and
`.nodeenv` out of source control; they are local environments that can be
recreated at any time.

### 4. Install the application dependencies

With the environments still active, install the packages declared in
`package.json`:

```powershell
npm install
```

`npm` installs these packages in the local `node_modules` folder, not globally.

### 5. Start the development server

```powershell
npm run dev
```

Vite will show the local URL in PowerShell. Open the displayed address—normally
[`http://localhost:3000`](http://localhost:3000)—in a browser. Stop the server
with <kbd>Ctrl</kbd> + <kbd>C</kbd>.

## Optional environment variables

The current interface runs with its included mock data and does not require an
environment file. `.env.example` documents `GEMINI_API_KEY` and `APP_URL` for
deployments or future server-side Gemini integrations. If your deployment needs
them, create a local `.env` file from the example and fill in real values:

```powershell
Copy-Item .env.example .env
```

Do not commit `.env` or API keys.

## Useful commands

Run these commands after activating `.venv` and `.nodeenv`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 3000. |
| `npm run lint` | Type-check the TypeScript source without creating output files. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Serve the production build locally after `npm run build`. |

## Later sessions and cleanup

Each time you open a new PowerShell window, return to the project and activate
both environments before running npm commands:

```powershell
cd C:\path\to\budiness-scheduler
.\.venv\Scripts\Activate.ps1
.\.nodeenv\Scripts\Activate.ps1
```

To leave the Node environment, run `deactivate_node`. To leave the Python
virtual environment, run `deactivate`. To fully reset the local setup, delete
`.venv`, `.nodeenv`, and `node_modules`, then repeat the installation steps.
