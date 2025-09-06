# SEO Task Automation Extension

A sophisticated Chrome extension designed for automating SEO-related video viewing tasks with intelligent task management and robust error handling.

## How to use..
https://github.com/user-attachments/assets/ff618c64-cef3-4e92-bf91-d8bef50e7043

## 🚀 Features

### Core Functionality
- **Automated Task Processing**: Automatically finds and clicks available tasks on SEO task websites
- **Intelligent Video Handling**: Manages video playback across multiple tabs with automatic redirection detection
- **Smart Task Selection**: Cycles through multiple tasks and automatically skips unavailable ones
- **Robust Error Recovery**: Advanced error handling with automatic page reloading and state restoration

### Advanced Capabilities
- **Service Worker Persistence**: Maintains extension state even after browser restarts
- **Multi-Duration Support**: Handles videos of various lengths (10s, 30s, 60s, 120s+)
- **Real-time Monitoring**: Continuous heartbeat system ensures uninterrupted operation
- **Memory Management**: Automatic cleanup of old tabs and resources

### User Interface
- **Simple Control Panel**: Easy start/stop functionality via popup interface
- **Real-time Status Updates**: Live task counter and extension status display
- **Visual Indicators**: Clear running/stopped status with animated indicators

## 🛠️ Technical Architecture

### Extension Components
- **Background Script** (`background.js`): Core logic and task management
- **Content Script** (`content.js`): Video interaction and playback handling
- **Popup Interface** (`popup.html`, `popup.js`): User control panel
- **Manifest** (`manifest.json`): Extension configuration and permissions

### Key Technologies
- **Manifest V3**: Latest Chrome extension standard
- **Service Workers**: Background processing and state management
- **Chrome APIs**: Tabs, scripting, storage, and notifications
- **XPath Selectors**: Precise element targeting
- **Async/Await**: Modern JavaScript for reliable operations

## 📋 Installation

### Prerequisites
- Google Chrome browser (version 88+)
- Developer mode enabled in Chrome extensions

### Setup Instructions
1. **Download the Extension**
   ```bash
   git clone https://github.com/Mehedinurnewaz/seo-task-automation
   cd seo-task-automation
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the project folder
   - The extension icon will appear in your toolbar

3. **Configure Permissions**
   - The extension will request necessary permissions automatically
   - Grant access to required websites when prompted

## 🎯 Usage Guide

### Basic Operation
1. **Start the Extension**
   - Click the extension icon in your Chrome toolbar
   - Press the "Start" button in the popup
   - The extension will automatically navigate to the task page

2. **Monitor Progress**
   - View real-time task completion count
   - Check extension status (Running/Stopped)
   - Observe automatic task processing

3. **Stop When Needed**
   - Click the "Stop" button to halt operations
   - Extension will safely close all related tabs
   - State is preserved for future sessions

### Advanced Features
- **Automatic Recovery**: Extension recovers from errors and continues processing
- **Smart Task Selection**: Automatically skips unavailable or completed tasks
- **Multi-tab Management**: Handles multiple video tabs simultaneously
- **State Persistence**: Maintains progress across browser sessions

## 🔧 Configuration

### Supported Websites
- `https://seo-task.com/*`
- `https://*.youtube.com/*`
- `https://liteshortvideos.blogspot.com/*`
- `https://googleads.g.doubleclick.net/*`

### Customizable Settings
- Task timeout duration (default: 5 minutes)
- Heartbeat interval (default: 30 seconds)
- Error recovery delay (default: 3.5 minutes)
- Tab cleanup interval (default: 5 minutes)

## 🏗️ Development

### Project Structure
```
seo-task-automation/
├── manifest.json          # Extension configuration
├── background.js          # Core background logic
├── content.js            # Video handling script
├── popup.html            # User interface
├── popup.js              # UI interaction logic
├── README.md             # Documentation
└── LICENSE               # License information
```

### Key Functions
- `findAndClickTask()`: Locates and clicks available tasks
- `checkForNewTabAfterClick()`: Verifies task success
- `handleErrorRecovery()`: Manages error scenarios
- `keepServiceWorkerAlive()`: Maintains extension persistence

### Development Setup
1. Clone the repository
2. Make your modifications
3. Test in Chrome developer mode
4. Submit pull requests for improvements

## 🐛 Troubleshooting

### Common Issues
- **Extension Stops Unexpectedly**: Check console for errors, restart if needed
- **Tasks Not Found**: Verify website structure hasn't changed
- **Video Not Playing**: Check content script permissions and ad blockers
- **Memory Issues**: Extension automatically cleans up old tabs

### Debug Mode
Enable Chrome DevTools console to view detailed logging:
- Background script logs: Extension service worker console
- Content script logs: Individual tab consoles
- Popup logs: Extension popup console

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
4. **Test Thoroughly**
5. **Submit a Pull Request**

### Code Standards
- Use modern JavaScript (ES6+)
- Follow consistent indentation (2 spaces)
- Add comments for complex logic
- Test all functionality before submitting

## 📄 License

This project is licensed under the MIT License with additional restrictions - see the [LICENSE](LICENSE) file for details.

**Important**: This extension is created strictly for educational and personal use only. Commercial use or any illegal activities are strictly prohibited.

## 👨‍💻 Author

**Mehedi Nur Newaz**
- **GitHub**: [@Mehedinurnewaz](https://github.com/Mehedinurnewaz)
- **LinkedIn**: [Mehedi Nur Newaz](https://www.linkedin.com/in/mehedinurnewaz)
- **Facebook**: [Md Mehedi Nur Newaz](https://www.facebook.com/Mdmehedinurnewaz)
- **Telegram**: [@Mehedinurnewaz](https://t.me/Mehedinurnewaz)

## 🙏 Acknowledgments

- Chrome Extension API documentation
- Open source community for inspiration
- Beta testers for valuable feedback

## �� Project Stats

- **Language**: JavaScript
- **Framework**: Chrome Extension API
- **Version**: 2.0
- **Last Updated**: 2024
- **Status**: Active Development

---

**⚠️ Disclaimer**: This extension is developed for educational purposes only. Users are responsible for ensuring compliance with website terms of service and applicable laws. The author assumes no liability for misuse of this software.

**🔒 Privacy**: This extension does not collect, store, or transmit any personal data. All operations are performed locally within your browser.
