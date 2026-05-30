// Get birthday date from localStorage
let birthdayDate = localStorage.getItem('birthdayDate');

// DOM elements
const birthdayInput = document.getElementById('birthdayInput');
const setButton = document.getElementById('setButton');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const messageEl = document.getElementById('message');
const celebrationEl = document.getElementById('celebration');

// Initialize
if (birthdayDate) {
    birthdayInput.value = birthdayDate;
    startCountdown();
} else {
    messageEl.textContent = 'Please select your birthday date';
    messageEl.classList.add('active');
}

// Set button click handler
setButton.addEventListener('click', () => {
    const selectedDate = birthdayInput.value;
    
    if (!selectedDate) {
        showMessage('Please select a date', 'error');
        return;
    }
    
    birthdayDate = selectedDate;
    localStorage.setItem('birthdayDate', birthdayDate);
    showMessage('Date saved successfully', 'success');
    
    setTimeout(() => {
        startCountdown();
    }, 1000);
});

// Countdown function
function startCountdown() {
    if (!birthdayDate) return;
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const [year, month, day] = birthdayDate.split('-');
        
        // Calculate next birthday
        let nextBirthday = new Date(new Date().getFullYear(), month - 1, day);
        
        if (now > nextBirthday.getTime()) {
            nextBirthday = new Date(new Date().getFullYear() + 1, month - 1, day);
        }
        
        const distance = nextBirthday.getTime() - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display
        updateNumber(daysEl, days);
        updateNumber(hoursEl, hours);
        updateNumber(minutesEl, minutes);
        updateNumber(secondsEl, seconds);
        
        // Update status message
        if (distance < 0) {
            clearInterval(interval);
            celebrate();
            showMessage('Happy Birthday! 🎉', 'celebration');
        } else if (days === 0 && hours === 0 && minutes === 0) {
            showMessage(`${seconds} seconds remaining`, 'urgent');
        } else if (days === 0 && hours === 0) {
            showMessage(`${minutes} minutes ${seconds} seconds remaining`, 'urgent');
        } else if (days === 0) {
            showMessage(`Today is the day! ${hours}:${minutes}:${seconds}`, 'urgent');
        } else if (days === 1) {
            showMessage('Tomorrow is your birthday!', 'soon');
        } else if (days <= 7) {
            showMessage(`${days} days remaining`, 'soon');
        } else if (days <= 30) {
            showMessage(`${days} days until your birthday`, 'normal');
        } else {
            showMessage(`${days} days to go`, 'normal');
        }
        
    }, 1000);
}

// Update number with animation
function updateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.2) rotateY(180deg)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1) rotateY(0deg)';
            element.style.opacity = '1';
        }, 250);
    }
}

// Show message
function showMessage(text, type = 'normal') {
    messageEl.textContent = text;
    messageEl.classList.add('active');
    
    // Reset and apply appropriate styling based on type
    messageEl.style.color = type === 'error' ? '#ff6b6b' : 
                           type === 'success' ? '#51cf66' :
                           type === 'urgent' ? '#ffd43b' :
                           type === 'celebration' ? '#ff6b6b' : '#eaeaea';
}

// Celebration effect
function celebrate() {
    celebrationEl.classList.add('active');
    createConfetti();
    
    // Add pulse animation to cards
    const cards = document.querySelectorAll('.countdown-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'pulse 1s ease-in-out infinite';
        }, index * 100);
    });
}

// Create confetti
function createConfetti() {
    const colors = ['#533483', '#0f3460', '#16213e', '#eaeaea', '#ffd43b', '#51cf66'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        celebrationEl.appendChild(confetti);
    }
}

// 3D card tilt effect on mouse move
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.countdown-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardX = (rect.left + rect.width / 2) / window.innerWidth;
        const cardY = (rect.top + rect.height / 2) / window.innerHeight;
        
        const deltaX = (mouseX - cardX) * 10;
        const deltaY = (mouseY - cardY) * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${-deltaY}deg)
            rotateY(${deltaX}deg)
            translateZ(0)
        `;
    });
});

// Reset card transform on mouse leave
document.querySelectorAll('.countdown-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Enter key to submit
birthdayInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setButton.click();
    }
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);
