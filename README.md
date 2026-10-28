<div align="center">

  <img src="icons/icon256.png" alt="Liya Browser Logo" width="128" height="128" />

  # Liya Browser 2.0
  
  **A fast, modern, sleek, and private Chromium-based web browser.**  
  *Engineered for speed, privacy, and distraction-free productivity.*

  <p align="center">
    <a href="https://github.com/hackertech142/liya-browser/releases"><img src="https://img.shields.io/badge/version-2.0.0-blue.svg?style=for-the-badge&logo=electron" alt="Version 2.0.0"></a>
    <a href="LICENSE.txt"><img src="https://img.shields.io/badge/License-Apache%202.0-green.svg?style=for-the-badge" alt="License Apache 2.0"></a>
    <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-orange.svg?style=for-the-badge" alt="Platforms">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome">
  </p>

</div>

---

## 🌟 Overview

**Liya Browser** is a next-generation web browser combining modern aesthetics with privacy-first architecture. Inspired by minimalist design languages (Safari, Arc), Liya strips away unnecessary browser bloat to give you ultra-low memory usage, blazing page-load times, and an intuitive, customizable user interface.

---

## ✨ Key Features

### 🎨 Modern & Minimalist UI
- **2-Row Sleek Layout**: Separate, clean top tab bar and navigation bar with zero clutter.
- **Glassmorphism & Theming**: Soft drop shadows, modern rounded contours, and responsive Dark/Light themes.
- **Fluid Chrome-Style Tabs**: Smooth horizontal scrolling, smart `+` button docking, and native window-caption button protection.

### 🏠 Interactive New Tab Dashboard
- **Live Weather Widget**: Instant local weather condition reports and temperatures.
- **Built-in To-Do Planner**: Add, manage, and check off daily tasks right from your new tab. Tasks persist automatically.
- **Instant Search Suggestions**: Search with live suggestions without ever leaving the dashboard.
- **Customizable Wallpapers**: Choose your own background wallpapers with fixed-aspect cinematic scaling.
- **Quick Access Links**: Pin your most-visited websites with crisp, recognizable favicons.

### 🛡️ Privacy & Security First
- **Zero Telemetry / Offline Storage**: Your browsing history and settings remain 100% on your local machine.
- **Built-in Ad & Tracker Blocker**: Blocks intrusive pop-ups, scripts, and fingerprinting trackers out of the box.
- **Stealth Private Browsing**: Isolated session tabs that leave zero traces on disk or history upon closing.

### 👆 Gesture & Navigation Controls
- **Trackpad / Wheel Gestures**: Natural 2-finger horizontal swipe navigation for instant Back and Forward page transitions.
- **Tab Switching Gestures**: Effortlessly switch between adjacent tabs using fluid gestures.
- **Keyboard-Driven Workflow**: Comprehensive shortcuts to navigate, search, and manage tabs without touching a mouse.

### 🌐 Multi-Language & Accessibility
- Full native localization support including **English**, **Hindi (हिंदी)**, and more.
- Built-in **Distraction-Free Reader View** for clean article reading with customizable typography and dark mode.
- **Task Groups & Overlay**: Organize sets of tabs into discrete task workspaces to keep projects segregated.

---

## ⌨️ Useful Keyboard Shortcuts

| Shortcut (Windows/Linux) | Shortcut (macOS) | Action |
|:---|:---|:---|
| <kbd>Ctrl</kbd> + <kbd>T</kbd> | <kbd>Cmd</kbd> + <kbd>T</kbd> | Open New Tab |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | <kbd>Cmd</kbd> + <kbd>W</kbd> | Close Current Tab |
| <kbd>Ctrl</kbd> + <kbd>Tab</kbd> | <kbd>Cmd</kbd> + <kbd>Tab</kbd> | Switch to Next Tab |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Tab</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Tab</kbd> | Switch to Previous Tab |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> | Open Private Tab |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | <kbd>Cmd</kbd> + <kbd>L</kbd> | Focus Address / Search Bar |
| <kbd>Ctrl</kbd> + <kbd>R</kbd> / <kbd>F5</kbd> | <kbd>Cmd</kbd> + <kbd>R</kbd> | Reload Page |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | <kbd>Cmd</kbd> + <kbd>F</kbd> | Find in Page |
| <kbd>Alt</kbd> + <kbd>←</kbd> | <kbd>Cmd</kbd> + <kbd>[</kbd> | Go Back |
| <kbd>Alt</kbd> + <kbd>→</kbd> | <kbd>Cmd</kbd> + <kbd>]</kbd> | Go Forward |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development system:
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hackertech142/liya-browser.git
   cd liya-browser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile assets & launch the browser in development mode:**
   ```bash
   npm start
   ```

---

## 📦 Building Installers / Distributables

To build stand-alone setup packages and executables for your target operating system:

| Platform | Build Command | Output Format |
|:---|:---|:---|
| **Windows** | `npm run buildWindows` | `.exe` Installer (Squirrel / NSIS) |
| **macOS (Apple Silicon)** | `npm run buildMacArm` | `.dmg` / `.zip` (ARM64) |
| **macOS (Intel)** | `npm run buildMacIntel` | `.dmg` / `.zip` (x64) |
| **Linux (Debian/Ubuntu)** | `npm run buildDebian` | `.deb` Package |
| **Linux (RHEL/Fedora)** | `npm run buildRpm` | `.rpm` Package |
| **Linux (Raspberry Pi/ARM)** | `npm run buildArm` | `.deb` (armv7l / arm64) |

The generated installer packages will be placed in the `dist/app` directory.

---

## 🛠️ Project Structure

```plaintext
liya-browser/
├── css/                  # UI stylesheets (tabs, theme, new tab, overlays)
│   ├── liya-theme.css    # Core design system & theme overrides
│   ├── newTabPage.css    # Dashboard & widgets styling
│   └── tabBar.css        # Tab bar layout & scroll rules
├── js/                   # Front-end renderer scripts
│   ├── navbar/           # Tab bar, address bar & tab management
│   ├── searchbar/        # Auto-complete, search plugins, instant answers
│   └── newTabPage.js     # Weather, to-do list, and dashboard logic
├── main/                 # Electron main-process scripts
│   ├── main.js           # Window creation & lifecycle
│   ├── viewManager.js    # WebContentsView orchestration
│   └── filtering.js      # Tracker and ad-blocking engine
├── icons/                # High-resolution logos & app icon bundles
├── package.json          # Build configurations, dependencies & scripts
└── README.md             # Project documentation
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are very welcome!
Feel free to open an issue or submit a Pull Request:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Liya Browser is open-source software licensed under the **Apache License 2.0**.  
See the [LICENSE.txt](LICENSE.txt) file for details.

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/hackertech142">hackertech142</a> and contributors.</sub>
</div>
