document.addEventListener('DOMContentLoaded', function() {
    
    // Debug message for page load
    console.log('Page loaded successfully - Fortune Generator initializing...');
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    const pageInfoDiv = document.getElementById('page-info');
    if (pageInfoDiv) {
        const pageLocation = window.location.href;
        const lastModified = document.lastModified;
        pageInfoDiv.innerHTML = 'Page Location: ' + pageLocation + '<br />Last Modified: ' + lastModified;
    }

    // Fortune Generator Implementation
    const fortunes = [
        "True wisdom comes not from knowledge, but from understanding.",
        "The journey of a thousand miles begins with a single step.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "In the middle of difficulty lies opportunity.",
        "The only way to do great work is to love what you do.",
        "Life is what happens to you while you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "The only impossible journey is the one you never begin.",
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn't just find you. You have to go out and get it.",
        "The harder you work for something, the greater you'll feel when you achieve it."
    ];

    // Function to create notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification) {
                notification.classList.add('notification-fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Function to get random fortune
    function getRandomFortune() {
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        console.log(`Selected fortune index: ${randomIndex}`);
        console.log(`Selected fortune: ${fortunes[randomIndex]}`);
        return fortunes[randomIndex];
    }

    // Display random fortune on page load
    const fortuneText = document.getElementById('fortune-text');
    const fortuneBox = document.getElementById('fortune-box');
    
    if (fortuneText && fortuneBox) {
        const selectedFortune = getRandomFortune();
        fortuneText.textContent = selectedFortune;
        console.log('Fortune displayed successfully');
        showNotification('Welcome! Your fortune has been revealed.', 'success');
    }

    // Color and style arrays for randomization
    const fontColors = ['#2c3e50', '#8e44ad', '#c0392b', '#d35400', '#27ae60', '#16a085'];
    const backgroundColors = ['#f8f9fa', '#e8f5e8', '#fff3cd', '#f8d7da', '#d1ecf1', '#e2e3e5'];
    const borderColors = ['#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#2ecc71', '#1abc9c'];
    const fontFamilies = [
        { family: "'Georgia', serif", size: '1.3em' },
        { family: "'Arial', sans-serif", size: '1.2em' },
        { family: "'Times New Roman', serif", size: '1.4em' },
        { family: "'Verdana', sans-serif", size: '1.1em' },
        { family: "'Courier New', monospace", size: '1.2em' }
    ];

    // Button event listeners
    const colorBtn1 = document.getElementById('color-btn-1');
    const colorBtn2 = document.getElementById('color-btn-2');
    const colorBtn3 = document.getElementById('color-btn-3');
    const colorBtn4 = document.getElementById('color-btn-4');

    if (colorBtn1) {
        colorBtn1.addEventListener('click', function() {
            const randomColor = fontColors[Math.floor(Math.random() * fontColors.length)];
            fortuneText.style.color = randomColor;
            console.log(`Font color changed to: ${randomColor}`);
            showNotification(`Font color changed to ${randomColor}`, 'info');
        });
    }

    if (colorBtn2) {
        colorBtn2.addEventListener('click', function() {
            const randomBgColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
            fortuneBox.style.backgroundColor = randomBgColor;
            console.log(`Background color changed to: ${randomBgColor}`);
            showNotification(`Background color updated`, 'info');
        });
    }

    if (colorBtn3) {
        colorBtn3.addEventListener('click', function() {
            const randomBorderColor = borderColors[Math.floor(Math.random() * borderColors.length)];
            fortuneBox.style.borderColor = randomBorderColor;
            console.log(`Border color changed to: ${randomBorderColor}`);
            showNotification(`Border color changed`, 'info');
        });
    }

    if (colorBtn4) {
        colorBtn4.addEventListener('click', function() {
            const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
            fortuneText.style.fontFamily = randomFont.family;
            fortuneText.style.fontSize = randomFont.size;
            console.log(`Font changed to: ${randomFont.family}, size: ${randomFont.size}`);
            showNotification(`Font style updated`, 'info');
        });
    }

    console.log('Fortune Generator initialized successfully');
});