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

// Text to Speech Support
class TextToSpeechHandler {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        this.initialize();
    }

    initialize() {
        // Aguarda as vozes serem carregadas
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.setPortugueseVoice();
            };
        }
        this.setPortugueseVoice();
    }

    setPortugueseVoice() {
        const voices = this.synthesis.getVoices();
        // Procura por uma voz em português
        this.voice = voices.find(voice => 
            voice.lang.includes('pt') || 
            voice.name.includes('Portuguese') || 
            voice.name.includes('Portugues')
        ) || voices[0]; // Se não encontrar, usa a primeira voz disponível
    }

    speak(text) {
        if (this.synthesis) {
            // Cancela qualquer fala em andamento
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voice;
            utterance.lang = 'pt-PT';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            this.synthesis.speak(utterance);
        }
    }

    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
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
    
    // Initialize text to speech handler
    const ttsHandler = new TextToSpeechHandler();
    
    // Initialize keyboard shortcut handler
    const keyboardHandler = new KeyboardShortcutHandler();

    // Apply accessibility settings
    function applyAccessibilitySettings() {
        const settings = getCookie('UserSettings');
        if (settings) {
            try {
                const userSettings = JSON.parse(settings);
                
                // Special handling for PIN input
                if (userSettings.AltoContraste) {
                    const pinInput = document.getElementById('pin');
                    if (pinInput) {
                        pinInput.style.backgroundColor = '#000000';
                        pinInput.style.color = '#ffff00';
                        pinInput.style.border = '2px solid #ffff00';
                        pinInput.style.fontWeight = 'bold';
                    }
                }
                
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
                                        // Skip SweetAlert elements
                                        if (!node.classList.contains('swal2-container') && 
                                            !node.closest('.swal2-container')) {
                                            applyHighContrastToElement(node);
                                        }
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

                // Ensure logo remains unchanged in both modes
                const logo = document.querySelector('.logo-area .logo');
                if (userSettings.ModoEscuro && userSettings.AltoContraste) {
                    logo.style.filter = 'none';
                    logo.style.background = 'none';
                    logo.style.border = 'none';
                } else {
                    logo.style.filter = '';
                    logo.style.background = '';
                    logo.style.border = '';
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

                // Adiciona leitura de texto para elementos importantes
                if (userSettings.LeitorTela) {
                    // Função para ler o texto de um elemento quando ele recebe foco
                    function readElementOnFocus(element) {
                        if (element && element.getAttribute('aria-label')) {
                            ttsHandler.speak(element.getAttribute('aria-label'));
                        } else if (element && element.textContent) {
                            ttsHandler.speak(element.textContent.trim());
                        }
                    }

                    // Adiciona leitura para elementos interativos
                    document.querySelectorAll('a, button, input, select, [role="button"]').forEach(element => {
                        element.addEventListener('focus', () => readElementOnFocus(element));
                    });

                    // Adiciona leitura para cabeçalhos
                    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(element => {
                        element.addEventListener('focus', () => readElementOnFocus(element));
                    });

                    // Adiciona leitura para mensagens importantes
                    document.querySelectorAll('.alert, .notification').forEach(element => {
                        element.addEventListener('focus', () => readElementOnFocus(element));
                    });
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
                element.style.color = '#ffff00'; // Changed to yellow for better visibility
                element.style.backgroundColor = '#000000';
            } else if (element.matches('img')) {
                // Handle images for better visibility in high contrast mode
                if (element.classList.contains('user-icon') || 
                    (element.src && element.src.includes('user.png')) || 
                    (element.src && element.src.includes('Breezeicons-actions-22-im-user'))) {
                    // User profile icon
                    element.style.border = '3px solid #ffff00';
                    element.style.backgroundColor = '#ffffff';
                    element.style.padding = '3px';
                    element.style.filter = 'invert(1)';
                } else if (element.classList.contains('logo')) {
                    // Logo
                    element.style.border = '3px solid #ffffff';
                    element.style.backgroundColor = '#ffffff';
                    element.style.padding = '5px';
                    element.style.filter = 'brightness(1.2) contrast(1.5)';
                } else if (element.closest('.menu-item')) {
                    // Menu icons
                    element.style.filter = 'invert(1) brightness(1.5)';
                    element.style.backgroundColor = 'transparent';
                    element.style.border = 'none';
                } else if (element.classList.contains('mb-img') || element.classList.contains('mbway-img')) {
                    // Payment method images - consistent styling for both
                    element.style.backgroundColor = '#ffffff';
                    element.style.border = '3px solid #ffff00';
                    element.style.padding = '8px';
                    element.style.margin = '5px';
                    element.style.borderRadius = '5px';
                    element.style.boxShadow = '0 0 0 2px #000000';
                    // Remove any filters that might affect the image
                    element.style.filter = 'none';
                }
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

    // Make handlers available globally
    window.voiceHandler = voiceHandler;
    window.ttsHandler = ttsHandler;
});