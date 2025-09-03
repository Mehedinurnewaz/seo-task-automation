// Updated Background Script for SEO Task Clicker with Continuous Processing
// This script handles the main logic of the extension, including tab management and continuous task processing

// Global variables
let isExtensionRunning = false;
let isProcessingTask = false;
let mainTabId = null;
let taskCounter = 0;
let autoShutdownTimer = null;
let manualStop = false;
let lastTaskTime = Date.now();
let heartbeatInterval = null;
let cleanupInterval = null;
const AUTO_SHUTDOWN_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Keep service worker alive
let keepAliveInterval = null;
function keepServiceWorkerAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  keepAliveInterval = setInterval(() => {
    if (isExtensionRunning) {
      console.log("🔄 Keeping service worker alive...");
      // Simple operation to keep service worker active
      chrome.storage.local.set({ keepAlive: Date.now() });
    }
  }, 25000); // Every 25 seconds
}

// Function to find and click task on the main page
async function findAndClickTask(tabId) {
  if (!isExtensionRunning || isProcessingTask) {
    return;
  }
  
  isProcessingTask = true;
  console.log(`🔍 টাস্ক খোঁজা হচ্ছে... (Task #${taskCounter + 1})`);
  
  const xpath = '//*[starts-with(@id,"job_area_")]/a';
  const maxAttempts = 50;
  const intervalMs = 1000;
  
  const injectSearchScript = (tabId, attempt = 0) => {
    if (!isExtensionRunning) {
      isProcessingTask = false;
      return;
    }
    
    if (attempt >= maxAttempts) {
      console.log("⚠️ সর্বোচ্চ চেষ্টার সংখ্যা পেরিয়ে গেছে, কোনো টাস্ক লিংক খুঁজে পাওয়া যায়নি। ৩.৫ মিনিট অপেক্ষা করে page reload করা হবে।");
      isProcessingTask = false;
      // Wait 3.5 minutes then reload page and try again
      if (isExtensionRunning) {
        setTimeout(() => {
          if (isExtensionRunning) {
            console.log("🔄 কোনো টাস্ক না পাওয়ার পর ৩.৫ মিনিট অপেক্ষা করে page reload করা হচ্ছে...");
            handleErrorRecovery();
          }
        }, 210000); // 3.5 minutes
      }
      return;
    }
    
    chrome.scripting.executeScript({
      target: { tabId },
      func: (xpath, attemptNumber) => {
        // Find all available task links
        const allResults = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const totalTasks = allResults.snapshotLength;
        
        if (totalTasks === 0) {
          return { success: false, totalTasks: 0, message: "No tasks found" };
        }
        
        // Try to click on a task that hasn't been tried yet
        // Use attempt number to cycle through different tasks
        const taskIndex = attemptNumber % totalTasks;
        const taskElement = allResults.snapshotItem(taskIndex);
        
        if (taskElement) {
          console.log(`✅ টাস্ক লিংক খুঁজে পাওয়া গেছে (${taskIndex + 1}/${totalTasks}), ক্লিক করা হচ্ছে...`);
          
          // Store which task we're clicking for tracking
          taskElement.setAttribute('data-clicked-attempt', attemptNumber);
          taskElement.click();
          
          return { 
            success: true, 
            totalTasks: totalTasks, 
            clickedIndex: taskIndex,
            taskText: taskElement.textContent?.trim() || 'Unknown task'
          };
        }
        
        return { success: false, totalTasks: totalTasks, message: "Task element not accessible" };
      },
      args: [xpath, attempt]
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error("Script injection error:", chrome.runtime.lastError);
        isProcessingTask = false;
        return;
      }
      
      const result = results?.[0]?.result;
      if (result?.success) {
        taskCounter++;
        lastTaskTime = Date.now(); // Update last task time
        console.log(`✅ Task #${taskCounter} শুরু হয়েছে - ${result.taskText} (${result.clickedIndex + 1}/${result.totalTasks})`);
        
        // Check if a new tab was opened after clicking the task
        checkForNewTabAfterClick(tabId, result.clickedIndex, result.totalTasks);
      } else {
        console.log(`⚠️ Task click failed: ${result?.message || 'Unknown error'}`);
        setTimeout(() => injectSearchScript(tabId, attempt + 1), intervalMs);
      }
    });
  };
  
  injectSearchScript(tabId);
}

// Function to check if a new tab was opened after clicking a task
function checkForNewTabAfterClick(mainTabId, clickedIndex = 0, totalTasks = 0) {
  const initialTabCount = videoTabs.size;
  const checkStartTime = Date.now();
  
  console.log(`🔍 Checking if task ${clickedIndex + 1}/${totalTasks} opened a new tab...`);
  
  // Wait 3 seconds to see if a new tab opens
  setTimeout(async () => {
    if (!isExtensionRunning) return;
    
    try {
      // Get current tabs to see if any new video tabs were created
      const allTabs = await chrome.tabs.query({});
      let newVideoTabFound = false;
      
      // Check if any new video tabs were created recently
      videoTabs.forEach((state, tabId) => {
        if (state.createdTime > checkStartTime - 1000) { // Created within last second
          newVideoTabFound = true;
        }
      });
      
      // Also check for any tabs with video URLs that might not be tracked yet
      for (const tab of allTabs) {
        if (tab.url && tab.url.includes("liteshortvideos.blogspot.com") && 
            tab.id !== mainTabId && !videoTabs.has(tab.id)) {
          newVideoTabFound = true;
          // Add to tracking
          videoTabs.set(tab.id, { isVideoTab: true, createdTime: Date.now() });
          console.log("🎯 নতুন ভিডিও ট্যাব সনাক্ত হয়েছে (delayed detection):", tab.url);
          chrome.tabs.sendMessage(tab.id, { action: "clickPlayButton" });
          break;
        }
      }
      
      if (newVideoTabFound) {
        console.log(`✅ Task ${clickedIndex + 1}/${totalTasks} সফল - নতুন ট্যাব খোলা হয়েছে`);
        // Task is successful, processing will continue when video completes
      } else {
        console.log(`⚠️ Task ${clickedIndex + 1}/${totalTasks} ব্যর্থ - কোনো নতুন ট্যাব খোলা হয়নি, পরবর্তী টাস্ক খোঁজা হচ্ছে...`);
        // No new tab opened, try next task
        isProcessingTask = false;
        
        // Try to find and click the next available task
        setTimeout(() => {
          if (isExtensionRunning && !isProcessingTask) {
            console.log("🔄 পরবর্তী উপলব্ধ টাস্ক খোঁজা হচ্ছে...");
            findAndClickTask(mainTabId);
          }
        }, 2000); // Wait 2 seconds before trying next task
      }
    } catch (error) {
      console.error("Error checking for new tab:", error);
      // On error, assume task failed and try next one
      isProcessingTask = false;
      setTimeout(() => {
        if (isExtensionRunning && !isProcessingTask) {
          console.log("🔄 Error এর কারণে পরবর্তী টাস্ক খোঁজা হচ্ছে...");
          findAndClickTask(mainTabId);
        }
      }, 2000);
    }
  }, 3000); // Wait 3 seconds for new tab to open
}

// Function to start the extension
async function startExtension() {
  if (isExtensionRunning) {
    console.log("⚠️ Extension ইতিমধ্যেই চলছে।");
    return;
  }
  
  isExtensionRunning = true;
  isProcessingTask = false;
  taskCounter = 0;
  manualStop = false; // Reset manual stop flag
  lastTaskTime = Date.now(); // Initialize last task time
  console.log("🚀 Extension শুরু করা হচ্ছে...");
  
  // Start service worker keep-alive mechanism
  keepServiceWorkerAlive();
  
  // Start heartbeat system
  startHeartbeat();
  
  // Start cleanup system
  startCleanupSystem();
  
  // Auto-shutdown disabled - extension will run indefinitely until manually stopped
  if (autoShutdownTimer) {
    clearTimeout(autoShutdownTimer);
    autoShutdownTimer = null;
  }
  
  console.log("⏰ Auto-shutdown disabled - Extension will run until manually stopped");
  
  // Update popup status (with error handling)
  try {
    chrome.runtime.sendMessage({ action: "updateStatus", status: "running", taskCount: taskCounter });
  } catch (error) {
    // Popup might be closed, ignore the error
  }
  
  // Find or create the main tab
  const tabs = await chrome.tabs.query({ url: "https://seo-task.com/job_youtube?area=view" });
  
  if (tabs.length > 0) {
    mainTabId = tabs[0].id;
    chrome.tabs.update(mainTabId, { active: true });
  } else {
    const newTab = await chrome.tabs.create({ url: "https://seo-task.com/job_youtube?area=view" });
    mainTabId = newTab.id;
  }
  
  // Wait a bit for the page to load, then start finding tasks
  setTimeout(() => {
    if (isExtensionRunning) {
      findAndClickTask(mainTabId);
    }
  }, 3000);
}

// Function to stop the extension (manual stop)
function stopExtension() {
  console.log("🛑 Extension ম্যানুয়ালি বন্ধ করা হচ্ছে...");
  console.trace("Stop extension called from:"); // Add stack trace to see what's calling this
  manualStop = true; // Mark as manual stop
  
  // Clear all timers and intervals
  if (autoShutdownTimer) {
    clearTimeout(autoShutdownTimer);
    autoShutdownTimer = null;
    console.log("⏰ Auto-shutdown timer বাতিল করা হয়েছে");
  }
  
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log("🔄 Keep-alive interval বাতিল করা হয়েছে");
  }
  
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log("💓 Heartbeat interval বাতিল করা হয়েছে");
  }
  
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log("🧹 Cleanup interval বাতিল করা হয়েছে");
  }
  
  isExtensionRunning = false;
  isProcessingTask = false;
  mainTabId = null;
  
  // Update popup status
  try {
    chrome.runtime.sendMessage({ action: "updateStatus", status: "stopped", taskCount: taskCounter });
  } catch (error) {
    // Popup might be closed, ignore the error
  }
}

// Function to auto-stop the extension (time-based)
function autoStopExtension() {
  console.log("⏰ Extension স্বয়ং���্রিয়ভাবে বন্ধ হচ্ছে (সময় শেষ)...");
  
  isExtensionRunning = false;
  isProcessingTask = false;
  mainTabId = null;
  autoShutdownTimer = null;
  
  // Update popup status
  try {
    chrome.runtime.sendMessage({ 
      action: "updateStatus", 
      status: "auto-stopped", 
      taskCount: taskCounter,
      reason: "Auto-shutdown after 2 hours"
    });
  } catch (error) {
    // Popup might be closed, ignore the error
  }
  
  // Show notification if possible
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'SEO Task Clicker',
      message: 'Extension automatically stopped after 2 hours of running.'
    });
  } catch (error) {
    // Notifications might not be available
    console.log("Notification not available");
  }
}

// Function to handle error recovery - reload page and resume
async function handleErrorRecovery() {
  if (!isExtensionRunning) return;
  
  console.log("🔧 Error recovery শুরু হচ্ছে...");
  
  try {
    // Try to find existing main tab first
    const tabs = await chrome.tabs.query({ url: "https://seo-task.com/job_youtube?area=view" });
    
    if (tabs.length > 0) {
      // Found existing tab, reload it
      mainTabId = tabs[0].id;
      console.log("🔄 Existing main tab reload করা হচ্ছে...");
      chrome.tabs.reload(mainTabId);
      chrome.tabs.update(mainTabId, { active: true });
    } else if (mainTabId) {
      // Check if current mainTabId is still valid
      try {
        const tab = await chrome.tabs.get(mainTabId);
        console.log("🔄 Main tab reload করা হচ্ছে...");
        chrome.tabs.reload(mainTabId);
        chrome.tabs.update(mainTabId, { active: true });
      } catch (error) {
        // Main tab doesn't exist, create new one
        console.log("🔄 নতুন main tab তৈরি করা হচ্ছে...");
        const newTab = await chrome.tabs.create({ url: "https://seo-task.com/job_youtube?area=view" });
        mainTabId = newTab.id;
      }
    } else {
      // No mainTabId set, create new tab
      console.log("🔄 নতুন main tab তৈরি করা হচ্ছে...");
      const newTab = await chrome.tabs.create({ url: "https://seo-task.com/job_youtube?area=view" });
      mainTabId = newTab.id;
    }
    
    // Wait for page to load then resume tasks
    setTimeout(() => {
      if (isExtensionRunning && !isProcessingTask) {
        console.log("✅ Error recovery সম্পন্ন, টাস্ক resume করা হ��্ছে...");
        lastTaskTime = Date.now(); // Reset timer
        findAndClickTask(mainTabId);
      }
    }, 5000); // Wait 5 seconds for page to load
    
  } catch (error) {
    console.error("Error recovery failed:", error);
    // Try again after another 3.5 minutes if recovery fails
    setTimeout(() => {
      if (isExtensionRunning) {
        console.log("🔄 Error recovery retry করা হচ্ছে...");
        handleErrorRecovery();
      }
    }, 210000); // Another 3.5 minutes
  }
}

// Track video tabs
const videoTabs = new Map();

// Detect new tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (isExtensionRunning) {
    videoTabs.set(tab.id, { isVideoTab: false, createdTime: Date.now() });
  }
});

// Detect tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, updatedTab) => {
  if (!isExtensionRunning) return;
  
  if (changeInfo.status === "complete") {
    const state = videoTabs.get(tabId);
    
    // Check if this is the main tab returning from a task
    if (tabId === mainTabId && updatedTab.url.includes("seo-task.com/job_youtube?area=view")) {
      console.log("📍 Main tab এ ফিরে এসেছে, ভিডিও সম্পন্ন হওয়ার জন্য অপেক্ষা করা হচ্ছে...");
      // Don't trigger next task here - wait for video processing to complete
      // Update task count in popup (with error handling)
      try {
        chrome.runtime.sendMessage({ action: "updateStatus", status: "running", taskCount: taskCounter });
      } catch (error) {
        // Popup might be closed, ignore the error
      }
    }
    
    // Check if this is a video page
    if (state && updatedTab.url.includes("liteshortvideos.blogspot.com")) {
      console.log("🎯 ভিডিও ট্যাব সনাক্ত হয়েছে:", updatedTab.url);
      chrome.tabs.sendMessage(tabId, { action: "clickPlayButton" });
      state.isVideoTab = true;
    }
    
    // Check if video tab needs to be closed
    if (state?.isVideoTab && 
        (updatedTab.url.includes("youtube.com/watch") || 
         updatedTab.url.includes("googleads.g.doubleclick.net/pagead/viewthroughconversion"))) {
      console.log("▶️ ভিডিও রিডাইরেক্ট হয়েছে, ট্যাব বন্ধ করা হচ্ছে...");
      
      chrome.tabs.remove(tabId);
      videoTabs.delete(tabId);
      
      // Reset processing state and focus back to main tab
      isProcessingTask = false;
      if (mainTabId) {
        chrome.tabs.update(mainTabId, { active: true });
        // Trigger next task search after video processing is complete
        setTimeout(() => {
          if (isExtensionRunning && !isProcessingTask) {
            console.log("🔄 ভিডিও সম্পন্ন, পরবর্তী টাস্ক খোঁজা হচ্ছে...");
            findAndClickTask(mainTabId);
          }
        }, 3000);
      }
    }
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  videoTabs.delete(tabId);
  if (tabId === mainTabId) {
    console.log("⚠️ Main tab বন্ধ হয়ে গেছে, কিন্তু Extension চালু রাখা হচ্ছে...");
    mainTabId = null;
    // Don't stop extension, just reset mainTabId
    // The heartbeat will recreate the main tab if needed
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender) => {
  switch(msg.action) {
    case "startExtension":
      startExtension();
      break;
      
    case "stopExtension":
      stopExtension();
      break;
      
    case "getStatus":
      chrome.runtime.sendMessage({
        action: "updateStatus",
        status: isExtensionRunning ? "running" : "stopped",
        taskCount: taskCounter
      });
      break;
      
    case "closeUnavailableTab":
      if (sender.tab && sender.tab.id) {
        console.log("❌ ভিডিও timeout বা সমস্যা হয়েছে, ৩.৫ মিনিট অপেক্ষা করে page reload করা হবে।");
        chrome.tabs.remove(sender.tab.id);
        videoTabs.delete(sender.tab.id);
        
        // Reset processing state
        isProcessingTask = false;
        
        // Wait 3.5 minutes then reload main page and resume
        setTimeout(() => {
          if (isExtensionRunning) {
            console.log("🔄 ৩.৫ মিনিট অপেক্ষার পর main page reload করা হচ্ছে...");
            handleErrorRecovery();
          }
        }, 210000); // 3.5 minutes = 210 seconds
      }
      break;
  }
});


// Heartbeat system functions
function startHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  heartbeatInterval = setInterval(async () => {
    if (!isExtensionRunning) return;
    
    const now = Date.now();
    const timeSinceLastTask = now - lastTaskTime;
    const maxIdleTime = 300000; // 5 minutes (300 seconds) - increased for 30s/60s videos
    
    // Only check if we're not currently processing a task
    if (timeSinceLastTask > maxIdleTime && !isProcessingTask) {
      console.log("💓 Heartbeat: Extension idle for too long, triggering error recovery...");
      handleErrorRecovery();
    }
    
    // Log current status for debugging
    if (isProcessingTask) {
      const processingTime = (now - lastTaskTime) / 1000;
      console.log(`💓 Heartbeat: Task processing for ${processingTime.toFixed(0)} seconds...`);
    }
    
    // Additional check: ensure main tab exists
    if (isExtensionRunning && !mainTabId) {
      console.log("💓 Heartbeat: Main tab missing, recreating...");
      try {
        const tabs = await chrome.tabs.query({ url: "https://seo-task.com/job_youtube?area=view" });
        if (tabs.length > 0) {
          mainTabId = tabs[0].id;
        } else {
          const newTab = await chrome.tabs.create({ url: "https://seo-task.com/job_youtube?area=view" });
          mainTabId = newTab.id;
        }
      } catch (error) {
        console.error("💓 Heartbeat: Failed to recreate main tab:", error);
      }
    }
  }, 30000); // Check every 30 seconds
}

function startCleanupSystem() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  
  cleanupInterval = setInterval(() => {
    if (!isExtensionRunning) return;
    
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    videoTabs.forEach((state, tabId) => {
      if (now - state.createdTime > fiveMinutes) {
        console.log("🧹 পুরানো ট্যাব পরিষ্কার করা হচ্ছে:", tabId);
        chrome.tabs.remove(tabId).catch(() => {});
        videoTabs.delete(tabId);
      }
    });
  }, 60000); // Check every minute
}

// Service worker startup - restore state if needed
chrome.runtime.onStartup.addListener(async () => {
  console.log("🔄 Service worker started, checking for previous state...");
  try {
    const result = await chrome.storage.local.get(['extensionRunning', 'taskCounter']);
    if (result.extensionRunning) {
      console.log("🔄 Restoring extension state after service worker restart...");
      isExtensionRunning = true;
      taskCounter = result.taskCounter || 0;
      lastTaskTime = Date.now();
      
      // Restart all systems
      keepServiceWorkerAlive();
      startHeartbeat();
      startCleanupSystem();
      
      // Find or create main tab
      const tabs = await chrome.tabs.query({ url: "https://seo-task.com/job_youtube?area=view" });
      if (tabs.length > 0) {
        mainTabId = tabs[0].id;
      } else {
        const newTab = await chrome.tabs.create({ url: "https://seo-task.com/job_youtube?area=view" });
        mainTabId = newTab.id;
      }
      
      // Resume task processing
      setTimeout(() => {
        if (isExtensionRunning && !isProcessingTask) {
          findAndClickTask(mainTabId);
        }
      }, 5000);
    }
  } catch (error) {
    console.error("Failed to restore state:", error);
  }
});

// Save state periodically
setInterval(() => {
  if (isExtensionRunning) {
    chrome.storage.local.set({
      extensionRunning: true,
      taskCounter: taskCounter,
      lastUpdate: Date.now()
    });
  } else {
    chrome.storage.local.set({
      extensionRunning: false
    });
  }
}, 30000); // Save every 30 seconds