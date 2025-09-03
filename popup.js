// Popup script for SEO Task Clicker

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("statusText");
const statusValue = document.querySelector(".status-value");
const taskCount = document.getElementById("taskCount");
const runningIndicator = document.getElementById("runningIndicator");

// Update UI based on status
function updateUI(status, count = 0, reason = null) {
  if (status === "running") {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = "Running";
    statusValue.className = "status-value running";
    runningIndicator.innerHTML = '<span class="running-indicator"></span>';
  } else if (status === "auto-stopped") {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.textContent = "Auto-Stopped";
    statusValue.className = "status-value stopped";
    runningIndicator.innerHTML = '';
    if (reason) {
      statusText.title = reason;
    }
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.textContent = "Stopped";
    statusValue.className = "status-value stopped";
    runningIndicator.innerHTML = '';
  }
  taskCount.textContent = count;
}

// Start button click handler
startBtn.addEventListener("click", async () => {
  console.log("Start button clicked");
  
  // Send message to background script to start
  chrome.runtime.sendMessage({ action: "startExtension" });
  
  // Update UI immediately
  updateUI("running", 0);
  
  // Also open/focus the main tab
  const url = "https://seo-task.com/job_youtube?area=view";
  const tabs = await chrome.tabs.query({ url });
  
  if (tabs.length === 0) {
    // Create new tab if doesn't exist
    await chrome.tabs.create({ url });
  } else {
    // Focus existing tab
    chrome.tabs.update(tabs[0].id, { active: true });
  }
});

// Stop button click handler
stopBtn.addEventListener("click", () => {
  console.log("Stop button clicked");
  
  // Send message to background script to stop
  chrome.runtime.sendMessage({ action: "stopExtension" });
  
  // Update UI immediately
  updateUI("stopped", parseInt(taskCount.textContent));
});

// Listen for status updates from background script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateStatus") {
    updateUI(msg.status, msg.taskCount, msg.reason);
  }
});

// Get initial status when popup opens
chrome.runtime.sendMessage({ action: "getStatus" });

// Also check status periodically while popup is open
setInterval(() => {
  chrome.runtime.sendMessage({ action: "getStatus" });
}, 1000);

// Social Media Links Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Social media URLs
  const socialLinks = {
    github: 'https://github.com/Mehedinurnewaz',
    linkedin: 'https://www.linkedin.com/in/mehedinurnewaz',
    facebook: 'https://www.facebook.com/Mdmehedinurnewaz',
    telegram: 'https://t.me/Mehedinurnewaz'
  };

  // Add click handlers for social links
  Object.keys(socialLinks).forEach(platform => {
    const linkElement = document.getElementById(`${platform}Link`);
    if (linkElement) {
      linkElement.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Open social media link in new tab
        chrome.tabs.create({ 
          url: socialLinks[platform],
          active: false // Don't switch to the new tab immediately
        });
        
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Log analytics (for development)
        console.log(`🔗 Social link clicked: ${platform}`);
      });
      
      // Add hover effect enhancement
      linkElement.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      linkElement.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    }
  });

  // Add developer section click handler for additional branding
  const developerSection = document.querySelector('.developer-section');
  if (developerSection) {
    developerSection.addEventListener('click', function(e) {
      // Only trigger if clicking on the section itself, not the social links
      if (e.target === this || e.target.classList.contains('developer-header') || 
          e.target.classList.contains('developer-info') || 
          e.target.classList.contains('developer-name') || 
          e.target.classList.contains('developer-title')) {
        
        // Open GitHub profile as default
        chrome.tabs.create({ 
          url: socialLinks.github,
          active: false
        });
        
        console.log('🚀 Developer section clicked - Opening GitHub profile');
      }
    });
  }

  // Add version info click handler
  const versionInfo = document.querySelector('.version-info');
  if (versionInfo) {
    versionInfo.addEventListener('click', function() {
      // Show extension details or changelog
      chrome.tabs.create({ 
        url: 'https://github.com/Mehedinurnewaz/seo-task-automation/blob/main/CHANGELOG.md',
        active: false
      });
      
      console.log('📋 Version info clicked - Opening changelog');
    });
    
    // Add hover effect for version info
    versionInfo.addEventListener('mouseenter', function() {
      this.style.cursor = 'pointer';
      this.style.transform = 'scale(1.02)';
    });
    
    versionInfo.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  }

  // Add professional branding message to console
  console.log(`
  🚀 SEO Task Automation Extension v2.0.0
  👨‍💻 Developed by: Mehedi Nur Newaz
  🔗 GitHub: https://github.com/Mehedinurnewaz
  💼 LinkedIn: https://www.linkedin.com/in/mehedinurnewaz
  📧 Contact: Available via social media links
  
  ⚡ Professional Chrome Extension Development
  🎯 Custom Automation Solutions Available
  `);
});

// Add professional startup message
console.log('🎨 Professional Extension UI Loaded - Mehedi Nur Newaz');