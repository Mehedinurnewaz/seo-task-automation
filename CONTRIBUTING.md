# Contributing to SEO Task Automation Extension

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
1. **Check Existing Issues**: Search existing issues before creating a new one
2. **Use Issue Templates**: Follow the provided templates for bug reports and feature requests
3. **Provide Details**: Include browser version, extension version, and steps to reproduce
4. **Screenshots**: Add screenshots or videos when applicable

### Suggesting Features
1. **Open a Discussion**: Start with a GitHub discussion for major features
2. **Explain the Use Case**: Describe why the feature would be valuable
3. **Consider Scope**: Ensure the feature aligns with the project's educational purpose
4. **Provide Examples**: Include mockups or examples when possible

### Code Contributions

#### Prerequisites
- Basic knowledge of JavaScript and Chrome Extension APIs
- Understanding of Manifest V3 specifications
- Familiarity with async/await patterns
- Chrome browser with Developer Mode enabled

#### Development Setup
1. **Fork the Repository**
   ```bash
   git fork https://github.com/Mehedinurnewaz/seo-task-automation
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/seo-task-automation
   cd seo-task-automation
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Load Extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" and select the project folder

#### Coding Standards

##### JavaScript Style
- Use modern ES6+ syntax
- Prefer `const` and `let` over `var`
- Use async/await instead of callbacks
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names

##### Code Structure
```javascript
// Good
async function findAndClickTask(tabId) {
  if (!isExtensionRunning || isProcessingTask) {
    return;
  }
  // ... implementation
}

// Avoid
function doStuff(x) {
  // unclear purpose and parameters
}
```

##### Comments and Documentation
- Add JSDoc comments for functions
- Explain complex logic with inline comments
- Update README.md for new features
- Include examples in documentation

```javascript
/**
 * Finds and clicks an available task on the main page
 * @param {number} tabId - The ID of the tab containing tasks
 * @returns {Promise<void>}
 */
async function findAndClickTask(tabId) {
  // Implementation here
}
```

#### Testing Guidelines
1. **Manual Testing**
   - Test all new functionality thoroughly
   - Verify existing features still work
   - Test in different scenarios (slow internet, blocked ads, etc.)

2. **Browser Compatibility**
   - Test in latest Chrome version
   - Verify Manifest V3 compliance
   - Check console for errors or warnings

3. **Edge Cases**
   - Test with no available tasks
   - Test with network interruptions
   - Test extension restart scenarios

#### Pull Request Process

##### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All new functionality is tested
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive

##### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Manual testing completed
- [ ] Edge cases considered
- [ ] No regressions found

## Screenshots (if applicable)
Add screenshots or videos demonstrating the changes
```

##### Review Process
1. **Automated Checks**: Ensure all checks pass
2. **Code Review**: Address reviewer feedback promptly
3. **Testing**: Verify functionality works as expected
4. **Approval**: Wait for maintainer approval before merging

## 📋 Development Guidelines

### File Organization
```
seo-task-automation/
├── manifest.json          # Extension configuration
├── background.js          # Core background logic
├── content.js            # Content script for video handling
├── popup.html            # Popup interface
├── popup.js              # Popup functionality
├── README.md             # Main documentation
├── LICENSE               # License information
├── CONTRIBUTING.md       # This file
└── .gitignore           # Git ignore rules
```

### Key Areas for Contribution

#### 1. Error Handling
- Improve error recovery mechanisms
- Add better error logging
- Handle edge cases gracefully

#### 2. Performance Optimization
- Reduce memory usage
- Optimize tab management
- Improve response times

#### 3. User Experience
- Enhance popup interface
- Add configuration options
- Improve status indicators

#### 4. Documentation
- Update README.md
- Add code comments
- Create usage examples

### Security Considerations
- Never include sensitive data in code
- Validate all user inputs
- Follow Chrome extension security best practices
- Respect website terms of service

## 🚫 What Not to Contribute

### Prohibited Contributions
- Features that violate website terms of service
- Commercial or monetization features
- Malicious or harmful functionality
- Code that compromises user privacy
- Illegal automation techniques

### Out of Scope
- Support for non-educational use cases
- Integration with paid services
- Features that harm website performance
- Bypassing security measures

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **LinkedIn**: [Mehedi Nur Newaz](https://www.linkedin.com/in/mehedinurnewaz)
- **Telegram**: [@Mehedinurnewaz](https://t.me/Mehedinurnewaz)

### Response Times
- Issues: Within 48 hours
- Pull Requests: Within 72 hours
- Discussions: Within 24 hours

## 🏆 Recognition

Contributors will be recognized in:
- README.md acknowledgments section
- Release notes for significant contributions
- GitHub contributor statistics

## 📄 License Agreement

By contributing to this project, you agree that:
- Your contributions will be licensed under the same license as the project
- You have the right to submit the contributions
- Your contributions are for educational purposes only
- You understand and agree to the project's usage restrictions

---

Thank you for contributing to the SEO Task Automation Extension! Your efforts help make this educational project better for everyone. 🚀