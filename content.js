// content.js - This script runs on the liteshortvideos.blogspot.com pages
// Handles video playing and monitors for redirection

console.log("🎯 Content script loaded in", window.location.href);

(function() {
    'use strict';
    
    let clickAttempts = 0;
    const maxClickAttempts = 10;
    
    function clickMiddleIfNotPlaying() {
        const video = document.querySelector("video");
        
        if (video && !video.paused) {
            console.log("✅ ভিডিও ইতিমধ্যে চলছে");
            return true;
        }
        
        if (clickAttempts >= maxClickAttempts) {
            console.log("⚠️ Maximum click attempts reached");
            return false;
        }
        
        clickAttempts++;
        
        // Try clicking on video element first if it exists
        if (video) {
            video.click();
            console.log(`▶️ ভিডিও element এ ক্লিক করা হলো (Attempt ${clickAttempts})`);
            
            // Also try to play programmatically
            video.play().catch(e => {
                console.log("Auto-play blocked, trying click method");
            });
        } else {
            // Click in the middle of the screen if no video element found
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            const el = document.elementFromPoint(x, y);
            
            if (el) {
                el.dispatchEvent(new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                }));
                console.log(`▶️ স্ক্রিনের মাঝখানে ক্লিক করা হলো (Attempt ${clickAttempts})`);
            }
        }
        
        return false;
    }
    
    // Function to check video status and handle playback
    function checkAndPlayVideo() {
        const videoPlaying = clickMiddleIfNotPlaying();
        
        if (!videoPlaying && clickAttempts < maxClickAttempts) {
            // Try again after a short delay
            setTimeout(checkAndPlayVideo, 1000);
        }
    }
    
    // Main initialization
    function initialize() {
        console.log("🌍 Initializing video handler...");
        
        // Start checking and playing video
        checkAndPlayVideo();
        
        // Set a timeout to close the tab after specified time if not redirected
        const timeoutInSeconds = 300; // 5 minutes - increased for 30s/60s videos + buffer
        let redirectTimeout = setTimeout(() => {
            console.log(`❌ ${timeoutInSeconds} সেকেন্ড পেরিয়ে গেছ��, YouTube এ রিডাইরেক্ট হয়নি। ট্যাব বন্ধ করা হচ্ছে।`);
            chrome.runtime.sendMessage({ action: "closeUnavailableTab" });
        }, timeoutInSeconds * 1000);
        
        // Check for redirection every second
        const redirectCheckInterval = setInterval(() => {
            const currentUrl = window.location.href;
            
            // Check if redirected to YouTube or ads
            if (currentUrl.includes("youtube.com/watch") || 
                currentUrl.includes("googleads.g.doubleclick.net")) {
                console.log("🎬 রিডাইরেক্ট detected, video completed successfully!");
                clearTimeout(redirectTimeout);
                clearInterval(redirectCheckInterval);
                
                // This is normal behavior - video completed and redirected
                // The background script will handle tab closure through tab update listener
                // No need to send closeUnavailableTab message for successful redirects
                console.log("✅ Video task completed successfully, letting background script handle tab closure");
            }
        }, 1000);
        
        // Also monitor for video element changes
        const observer = new MutationObserver(() => {
            const video = document.querySelector("video");
            if (video && video.paused && clickAttempts < maxClickAttempts) {
                console.log("📹 Video element detected, attempting to play...");
                checkAndPlayVideo();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already loaded
        initialize();
    }
    
    // Also initialize on window load for extra safety
    window.addEventListener('load', () => {
        console.log("🔄 Window loaded, rechecking video status...");
        if (clickAttempts === 0) {
            initialize();
        }
    });
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.action === "clickPlayButton") {
            console.log("📨 Received message to click play button");
            checkAndPlayVideo();
            sendResponse({ status: "attempted" });
        }
    });
})();