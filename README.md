# Liya Browser

Liya Browser is a fast, modern, sleek, and private Chromium-based web browser designed to minimize distractions and maximize productivity.

## Features

- **Blazing Fast & Lightweight**: Uses minimal system resources for a smooth browsing experience.
- **Integrated To-Do List**: Keep track of your tasks directly from the New Tab Page.
- **Dynamic Quick Links**: Easily pin your favorite websites and access them instantly.
- **Privacy First**: 100% offline history storage with no forced cloud syncing.
- **Weather Widget**: Real-time weather updates integrated into your dashboard.
- **Customizable Backgrounds**: Personalize your browser by setting your own background images.
- **Ad & Tracker Blocking**: Built-in privacy protections.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- Git for cloning the repository.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hackertech142/liya-browser.git
   cd liya-browser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in Development Mode:**
   ```bash
   npm run start
   ```

## Building the Browser

To create an installer (Setup file) for Liya Browser, run the following command based on your operating system:

- **Windows:** `npm run buildWindows`
- **Mac (Intel):** `npm run buildMacIntel`
- **Mac (ARM/Apple Silicon):** `npm run buildMacArm`
- **Linux (Debian/Ubuntu):** `npm run buildDebian`

The generated setup files will be available in the `dist/app` folder.

## License

Liya Browser is licensed under the Apache License 2.0. See [LICENSE.txt](LICENSE.txt) for more details.
