// Minecraft Bedwars Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize animations and effects
    initializeAnimations();
    initializeFormValidation();
    initializeTableEffects();
    initializeKeyboardShortcuts();
    
    function initializeAnimations() {
        // Add stagger animation to player rows
        const playerRows = document.querySelectorAll('.player-row');
        playerRows.forEach((row, index) => {
            row.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.minecraft-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                createClickEffect(e, this);
            });
        });
        
        // Add typing sound effect simulation
        const inputs = document.querySelectorAll('.minecraft-input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }
    
    function initializeFormValidation() {
        const form = document.getElementById('addPlayerForm');
        if (!form) return; // Exit if form doesn't exist (non-admin users)
        
        const nicknameInput = form.querySelector('input[name="nickname"]');
        const numberInputs = form.querySelectorAll('input[type="number"]');
        
        // Real-time validation
        nicknameInput.addEventListener('input', function() {
            validateNickname(this);
        });
        
        numberInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateNumber(this);
            });
        });
        
        // Form submission with enhanced feedback
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                showValidationError();
            } else {
                showSubmissionFeedback();
            }
        });
        
        function validateNickname(input) {
            const value = input.value.trim();
            const isValid = value.length >= 2 && value.length <= 20;
            
            if (value && !isValid) {
                input.style.borderColor = 'var(--bedwars-red)';
                input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
            
            return isValid;
        }
        
        function validateNumber(input) {
            const value = parseInt(input.value);
            const isValid = !isNaN(value) && value >= 0 && value <= 999999;
            
            if (input.value && !isValid) {
                input.style.borderColor = 'var(--bedwars-red)';
                input.style.boxShadow = '0 0 10px rgba(255, 85, 85, 0.5)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
            
            return isValid;
        }
        
        function validateForm() {
            const nicknameValid = validateNickname(nicknameInput);
            const numbersValid = Array.from(numberInputs).every(input => 
                !input.value || validateNumber(input)
            );
            return nicknameValid && numbersValid && nicknameInput.value.trim();
        }
        
        function showValidationError() {
            // Create temporary error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'flash-message flash-error';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Проверьте правильность введенных данных!';
            
            form.parentNode.insertBefore(errorDiv, form);
            
            // Remove after 3 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }
        
        function showSubmissionFeedback() {
            const submitBtn = form.querySelector('.minecraft-btn-primary');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ДОБАВЛЕНИЕ...';
            submitBtn.disabled = true;
            
            // This will be reset by page reload, but provides immediate feedback
        }
    }
    
    function initializeTableEffects() {
        const rows = document.querySelectorAll('.player-row');
        
        rows.forEach(row => {
            // Add hover sound effect simulation
            row.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            // Add click effect for mobile
            row.addEventListener('click', function() {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
        
        // Add special effects for top 3 players
        const topThree = document.querySelectorAll('.player-row.rank-1, .player-row.rank-2, .player-row.rank-3');
        topThree.forEach(row => {
            row.addEventListener('mouseenter', function() {
                const rankIcon = this.querySelector('.rank-icon');
                if (rankIcon) {
                    rankIcon.style.animation = 'rank-pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        rankIcon.style.animation = 'rank-pulse 2s ease-in-out infinite';
                    }, 500);
                }
            });
        });
    }
    
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + A to focus on name input
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                const nameInput = document.querySelector('input[name="name"]');
                if (nameInput) {
                    nameInput.focus();
                    nameInput.select();
                }
            }
            
            // Alt + S to focus on score input
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                const scoreInput = document.querySelector('input[name="score"]');
                if (scoreInput) {
                    scoreInput.focus();
                    scoreInput.select();
                }
            }
            
            // Enter to submit form when inputs are focused
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('minecraft-input')) {
                    e.preventDefault();
                    document.getElementById('addPlayerForm').requestSubmit();
                }
            }
        });
    }
    
    function createClickEffect(event, button) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Auto-hide flash messages
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.transition = 'all 0.5s ease-out';
            message.style.transform = 'translateX(100%)';
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 5000);
    });
    
    // Add loading state to clear button
    const clearButton = document.querySelector('.minecraft-btn-danger');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            if (this.innerHTML.includes('ОЧИСТИТЬ')) {
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ОЧИСТКА...';
                    this.disabled = true;
                }, 100);
            }
        });
    }
    
    // Smooth scroll to top functionality
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 200 && !document.querySelector('.scroll-to-top')) {
            createScrollToTopButton();
        } else if (scrollTop <= 200) {
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) {
                scrollBtn.remove();
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    function createScrollToTopButton() {
        const scrollBtn = document.createElement('div');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--bedwars-blue), #3333cc);
            border: 2px solid #6666ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 0 #2222aa, 0 0 20px rgba(85, 85, 255, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
            animation: fadeInUp 0.3s ease-out;
        `;
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        document.body.appendChild(scrollBtn);
    }
    
    // Initialize random background animation changes
    setInterval(() => {
        const overlay = document.querySelector('.bedwars-overlay');
        if (overlay) {
            const colors = ['85, 85, 255', '255, 85, 85', '85, 255, 85', '255, 255, 85'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            overlay.style.background = `radial-gradient(
                ellipse at center,
                rgba(${randomColor}, 0.05) 0%,
                rgba(${colors[(colors.indexOf(randomColor) + 1) % colors.length]}, 0.05) 50%,
                rgba(${colors[(colors.indexOf(randomColor) + 2) % colors.length]}, 0.05) 100%
            )`;
        }
    }, 10000);
});

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export functions for potential use in other scripts
window.MinecraftBedwars = {
    formatNumber,
    showNotification
};
