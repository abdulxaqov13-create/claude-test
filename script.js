// LocalStoragedan tug'ilgan kunni olish
let birthdayDate = localStorage.getItem('birthdayDate');

// DOM elementlari
const birthdayInput = document.getElementById('birthdayInput');
const setButton = document.getElementById('setButton');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const messageEl = document.getElementById('message');

// Agar saqlangan sana bo'lsa, input ga qo'yish
if (birthdayDate) {
    birthdayInput.value = birthdayDate;
    startCountdown();
} else {
    messageEl.textContent = '👆 Tug\'ilgan kuningizni kiriting';
}

// Saqlash tugmasi bosilganda
setButton.addEventListener('click', () => {
    const selectedDate = birthdayInput.value;
    
    if (!selectedDate) {
        messageEl.textContent = '⚠️ Iltimos, sanani tanlang!';
        messageEl.style.color = '#ff6b6b';
        return;
    }
    
    birthdayDate = selectedDate;
    localStorage.setItem('birthdayDate', birthdayDate);
    messageEl.style.color = 'white';
    messageEl.textContent = '✅ Saqlandi! Countdown boshlandi...';
    
    setTimeout(() => {
        startCountdown();
    }, 1000);
});

// Countdown funksiyasi
function startCountdown() {
    if (!birthdayDate) return;
    
    // Har soniyada yangilanish
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const [year, month, day] = birthdayDate.split('-');
        
        // Keyingi tug'ilgan kunni topish
        let nextBirthday = new Date(new Date().getFullYear(), month - 1, day);
        
        // Agar bu yilgi tug'ilgan kun o'tib ketgan bo'lsa, keyingi yilga o'tkazish
        if (now > nextBirthday.getTime()) {
            nextBirthday = new Date(new Date().getFullYear() + 1, month - 1, day);
        }
        
        const distance = nextBirthday.getTime() - now;
        
        // Vaqt hisoblari
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Ekranda ko'rsatish - animatsiya bilan
        updateNumber(daysEl, days);
        updateNumber(hoursEl, hours);
        updateNumber(minutesEl, minutes);
        updateNumber(secondsEl, seconds);
        
        // Xabarlar
        if (distance < 0) {
            clearInterval(interval);
            celebrate();
            messageEl.textContent = '🎉 TUG\'ILGAN KUNINGIZ MUBORAK! 🎉';
            messageEl.style.fontSize = '2.5rem';
            createConfetti();
        } else if (days === 0 && hours === 0 && minutes === 0) {
            messageEl.textContent = `⏰ ${seconds} soniyadan keyin tug'ilgan kuningiz!`;
        } else if (days === 0 && hours === 0) {
            messageEl.textContent = `⏰ ${minutes} daqiqa ${seconds} soniyadan keyin!`;
        } else if (days === 0) {
            messageEl.textContent = `🎈 Bugun tug'ilgan kuningiz! ${hours}:${minutes}:${seconds}`;
        } else if (days === 1) {
            messageEl.textContent = '🎊 Ertaga tug\'ilgan kuningiz!';
        } else if (days <= 7) {
            messageEl.textContent = `🎁 ${days} kundan keyin tug'ilgan kuningiz!`;
        } else if (days <= 30) {
            messageEl.textContent = `📅 ${days} kun qoldi!`;
        } else {
            messageEl.textContent = `⏳ Tug'ilgan kuningizga ${days} kun qoldi`;
        }
        
        // Yaqinlashgan sari ko'proq animatsiya
        if (days < 7) {
            addExtraAnimations();
        }
        
    }, 1000);
}

// Raqamni animatsiya bilan yangilash
function updateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.2) rotateY(360deg)';
        element.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1) rotateY(0deg)';
        }, 250);
    }
}

// Qo'shimcha animatsiyalar (7 kundan kam qolganda)
function addExtraAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'cardFlip 2s ease-in-out infinite';
        }, index * 200);
    });
}

// Bayram animatsiyasi
function celebrate() {
    document.body.style.animation = 'rainbow 3s infinite';
    
    // Rainbow animatsiya CSS qo'shish
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Kartalarni aylantirish
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'cardFlip 1s ease-in-out infinite';
        }, index * 100);
    });
}

// Konfetti yaratish
function createConfetti() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    
    // 100 ta konfetti yaratish
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        celebration.appendChild(confetti);
    }
}

// 3D effektlar - kursorni kuzatish
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const xRotation = (mouseY - 0.5) * 20;
        const yRotation = (mouseX - 0.5) * 20;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${-xRotation}deg)
            rotateY(${yRotation}deg)
            translateZ(50px)
        `;
    });
});

// Kartaga hover qilganda
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.1) translateZ(80px)';
        card.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) translateZ(50px)';
    });
});

// Sahifa yuklanganda animatsiya
window.addEventListener('load', () => {
    const content = document.querySelector('.content');
    content.style.opacity = '0';
    content.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        content.style.transition = 'all 1s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 100);
});

// Enter tugmasini bosishda ham saqlash
birthdayInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setButton.click();
    }
});

// Random balloons generatsiya
setInterval(() => {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = ['🎈', '🎉', '🎊', '🎁', '🎂'][Math.floor(Math.random() * 5)];
    balloon.style.left = Math.random() * 100 + '%';
    balloon.style.fontSize = (Math.random() * 2 + 2) + 'rem';
    balloon.style.animation = `balloonFloat ${Math.random() * 3 + 4}s ease-in-out`;
    
    document.querySelector('.balloons').appendChild(balloon);
    
    setTimeout(() => {
        balloon.remove();
    }, 8000);
}, 3000);

// Console da ranglar
console.log('%c🎉 Tug\'ilgan Kun Countdown Web Sayti 🎉', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cYaratildi ❤️ bilan', 'font-size: 14px; color: #764ba2;');
