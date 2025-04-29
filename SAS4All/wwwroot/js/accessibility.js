// Voice Command Support
class VoiceCommandHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = new Map();
        this.initialize();
    }

    initialize() {
        // Check for browser compatibility
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'pt-PT';

            this.recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.toLowerCase().trim();
                console.log('Voice command detected:', command); // Debug log
                this.handleCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.stopListening();
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    // Restart recognition if it ends unexpectedly
                    this.recognition.start();
                }
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
                this.isListening = true;
                console.log('Voice recognition started'); // Debug log
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                this.stopListening();
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
                this.isListening = false;
                console.log('Voice recognition stopped'); // Debug log
            } catch (error) {
                console.error('Error stopping voice recognition:', error);
            }
        }
    }

    registerCommand(command, callback) {
        this.commands.set(command.toLowerCase(), callback);
        console.log(`Command registered: ${command}`); // Debug log
    }

    handleCommand(command) {
        console.log('Available commands:', Array.from(this.commands.keys())); // Debug log
        for (const [registeredCommand, callback] of this.commands) {
            if (command.includes(registeredCommand)) {
                console.log(`Executing command: ${registeredCommand}`); // Debug log
                callback();
                break;
            }
        }
    }
}

// Keyboard Shortcuts
class KeyboardShortcutHandler {
    constructor() {
        this.shortcuts = new Map();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    registerShortcut(key, callback) {
        this.shortcuts.set(key.toLowerCase(), callback);
    }

    handleKeyPress(event) {
        const key = event.key.toLowerCase();
        if (this.shortcuts.has(key)) {
            event.preventDefault();
            this.shortcuts.get(key)();
        }
    }
}

// Initialize accessibility features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize voice command handler
    const voiceHandler = new VoiceCommandHandler();

    // Initialize keyboard shortcut handler
    const keyboardHandler = new KeyboardShortcutHandler();

    // Apply accessibility settings
    function applyAccessibilitySettings() {
        const settings = getCookie('UserSettings');
        if (settings) {
            try {
                const userSettings = JSON.parse(settings);
                
                // Apply high contrast mode
                if (userSettings.AltoContraste) {
                    document.body.classList.add('high-contrast');
                    document.documentElement.setAttribute('data-contrast', 'high');
                    
                    // Force high contrast on dynamically loaded content
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.addedNodes.length) {
                                mutation.addedNodes.forEach((node) => {
                                    if (node.nodeType === 1) { // Element node
                                        applyHighContrastToElement(node);
                                    }
                                });
                            }
                        });
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    document.body.classList.remove('high-contrast');
                    document.documentElement.removeAttribute('data-contrast');
                }

                // Apply dark mode
                if (userSettings.ModoEscuro) {
                    document.body.classList.add('dark-mode');
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    document.documentElement.removeAttribute('data-theme');
                }

                // Apply font size
                if (userSettings.TamanhoFonte) {
                    document.body.style.fontSize = userSettings.TamanhoFonte;
                    document.body.classList.remove('font-size-18', 'font-size-20', 'font-size-22', 'font-size-24');
                    if (userSettings.TamanhoFonte !== '16px') {
                        document.body.classList.add(`font-size-${userSettings.TamanhoFonte.replace('px', '')}`);
                    }
                }

                // Apply spacing
                if (userSettings.Espacamento) {
                    document.body.classList.remove('spacing-wide', 'spacing-extra-wide');
                    if (userSettings.Espacamento !== 'normal') {
                        document.body.classList.add(`spacing-${userSettings.Espacamento}`);
                    }
                }
            } catch (error) {
                console.error('Error applying accessibility settings:', error);
            }
        }
    }

    // Helper function to apply high contrast to a specific element and its children
    function applyHighContrastToElement(element) {
        if (element.nodeType === 1) { // Element node
            // Apply high contrast styles based on element type
            if (element.matches('a, button, input, select, textarea')) {
                element.style.backgroundColor = '#000000';
                element.style.color = '#ffff00';
                element.style.border = '2px solid #ffff00';
            } else if (element.matches('p, span, div, h1, h2, h3, h4, h5, h6')) {
                element.style.color = '#ffffff';
                element.style.backgroundColor = '#000000';
            }

            // Process children
            element.childNodes.forEach(child => {
                applyHighContrastToElement(child);
            });
        }
    }

    // Helper function to get cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Apply settings on page load
    applyAccessibilitySettings();

    // Apply settings when they change
    document.addEventListener('accessibilitySettingsChanged', applyAccessibilitySettings);

    // Register default shortcuts
    keyboardHandler.registerShortcut('h', () => {
        window.location.href = '/Home';
    });

    keyboardHandler.registerShortcut('a', () => {
        window.location.href = '/Accessibility';
    });

    keyboardHandler.registerShortcut('p', () => {
        window.location.href = '/Account/Profile';
    });

    keyboardHandler.registerShortcut('m', () => {
        window.location.href = '/Transactions';
    });

    keyboardHandler.registerShortcut('r', () => {
        window.location.href = '/Meals';
    });

    keyboardHandler.registerShortcut('c', () => {
        window.location.href = '/Charging';
    });

    // New shortcuts
    keyboardHandler.registerShortcut('i', () => {
        window.location.href = '/Account/Pin';
    });

    keyboardHandler.registerShortcut('w', () => {
        if (window.location.pathname.includes('/Charging')) {
            window.location.href = '/Charging/MBWay';
        }
    });

    keyboardHandler.registerShortcut('b', () => {
        if (window.location.pathname.includes('/Charging')) {
            window.location.href = '/Charging/Multibanco';
        }
    });

    keyboardHandler.registerShortcut('v', () => {
        window.location.href = '/Home/Privacy';
    });

    // Register voice commands
    voiceHandler.registerCommand('início', () => window.location.href = '/Home');
    voiceHandler.registerCommand('acessibilidade', () => window.location.href = '/Accessibility');
    voiceHandler.registerCommand('perfil', () => window.location.href = '/Account/Profile');
    voiceHandler.registerCommand('movimentos', () => window.location.href = '/Transactions');
    voiceHandler.registerCommand('refeições', () => window.location.href = '/Meals');
    voiceHandler.registerCommand('carregamentos', () => window.location.href = '/Charging');

    // New voice commands
    voiceHandler.registerCommand('pin', () => window.location.href = '/Account/Pin');
    voiceHandler.registerCommand('telemóvel', () => {
        if (window.location.pathname.includes('/Charging')) {
            window.location.href = '/Charging/MBWay';
        }
    });
    voiceHandler.registerCommand('multibanco', () => {
        if (window.location.pathname.includes('/Charging')) {
            window.location.href = '/Charging/Multibanco';
        }
    });
    voiceHandler.registerCommand('privacidade', () => window.location.href = '/Home/Privacy');

    // Make voiceHandler available globally
    window.voiceHandler = voiceHandler;
});