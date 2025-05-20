// Voice Command Support
class VoiceCommandHandler {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = new Map();
        this.tts = null;
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
                if (this.tts) {
                    this.tts.speak('Comandos de voz ativados');
                }
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
                if (this.tts) {
                    this.tts.speak('Comandos de voz desativados');
                }
            } catch (error) {
                console.error('Error stopping voice recognition:', error);
            }
        }
    }

    registerCommand(command, callback) {
        this.commands.set(command.toLowerCase(), callback);
        console.log(`Command registered: ${command}`); // Debug log
    }

    setTTSHandler(ttsHandler) {
        this.tts = ttsHandler;
    }

    handleCommand(command) {
        console.log('Available commands:', Array.from(this.commands.keys())); // Debug log
        for (const [registeredCommand, callback] of this.commands) {
            if (command.includes(registeredCommand)) {
                console.log(`Executing command: ${registeredCommand}`); // Debug log
                if (this.tts) {
                    // Announce what command was recognized
                    this.tts.speak(`Comando reconhecido: ${registeredCommand}`);
                    setTimeout(() => {
                        callback();
                    }, 1500); // Wait for the speech to finish before executing
                } else {
                    callback();
                }
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
    }    handleKeyPress(event) {
        // Verifica se alguma tecla modificadora está pressionada (Ctrl, Alt, Shift, Meta/Windows)
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
            return;
        }
        
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
    
    // Connect TTS to voice handler
    voiceHandler.setTTSHandler(ttsHandler);
    
    // Initialize keyboard shortcut handler
    const keyboardHandler = new KeyboardShortcutHandler();

    // Initialize font size value display and slider
    const fontSizeInput = document.getElementById('tamanho-fonte');
    const fontSizeValue = document.getElementById('tamanho-fonte-value');
    
    if (fontSizeInput && fontSizeValue) {
        // Set initial value
        fontSizeValue.textContent = `${fontSizeInput.value}px`;
        document.body.style.fontSize = `${fontSizeInput.value}px`;
        
        // Update value display and apply font size in real-time
        fontSizeInput.addEventListener('input', function() {
            const size = `${this.value}px`;
            fontSizeValue.textContent = size;
            document.body.style.fontSize = size;
            // Dynamically update class for consistent styling
            document.body.classList.forEach(cls => {
                if (cls.startsWith('font-size-')) {
                    document.body.classList.remove(cls);
                }
            });
            document.body.classList.add(`font-size-${this.value}`);
        });
    }    // Apply accessibility settings    function applyAccessibilitySettings() {
        try {
            const cookie = getCookie('UserSettings');
            if (cookie) {
                const settings = JSON.parse(cookie);
                
                // Remove all special mode classes first
                document.body.classList.remove('high-contrast', 'dark-mode');
                document.documentElement.removeAttribute('data-contrast');
                document.documentElement.removeAttribute('data-theme');
                
                // Handle both modes independently
                if (settings.AltoContraste) {
                    document.body.classList.add('high-contrast');
                    document.documentElement.setAttribute('data-contrast', 'high');
                }
                
                if (settings.ModoEscuro) {
                    document.body.classList.add('dark-mode');
                    document.documentElement.setAttribute('data-theme', 'dark');
                }
                
                // Enforce high contrast styles over dark mode when both are enabled
                if (settings.AltoContraste && settings.ModoEscuro) {
                    document.documentElement.setAttribute('data-theme', 'high-contrast');
                }

                // Apply font size
                if (settings.TamanhoFonte) {
                    const fontSize = `${settings.TamanhoFonte}px`;
                    document.body.style.fontSize = fontSize;
                    if (fontSizeInput && fontSizeValue) {
                        fontSizeInput.value = settings.TamanhoFonte;
                        fontSizeValue.textContent = fontSize;
                    }
                    
                    // Update font size classes
                    document.body.classList.forEach(cls => {
                        if (cls.startsWith('font-size-')) {
                            document.body.classList.remove(cls);
                        }
                    });
                    if (settings.TamanhoFonte !== 16) {
                        document.body.classList.add(`font-size-${settings.TamanhoFonte}`);
                    }
                }
                
                // Apply spacing
                if (settings.Espacamento) {
                    document.body.classList.remove('spacing-wide', 'spacing-extra-wide');
                    if (settings.Espacamento !== 'normal') {
                        document.body.classList.add(`spacing-${settings.Espacamento}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error applying accessibility settings:', error);
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
    }    // Helper function to handle accessibility mode changes
    function checkAccessibilityModeConflicts() {
        const darkModeCheckbox = document.getElementById('modo-escuro');
        const highContrastCheckbox = document.getElementById('alto-contraste');
        
        if (darkModeCheckbox && highContrastCheckbox) {
            // Both modes can now be active simultaneously
            // High contrast will take precedence in the styling
            highContrastCheckbox.disabled = false;
            darkModeCheckbox.disabled = false;
            darkModeCheckbox.parentElement.style.opacity = '1';
            highContrastCheckbox.parentElement.style.opacity = '1';
            
            // Update the appearance based on both modes
            const settings = {};
            settings.ModoEscuro = darkModeCheckbox.checked;
            settings.AltoContraste = highContrastCheckbox.checked;
            
            // Save settings to cookie
            document.cookie = `UserSettings=${JSON.stringify(settings)}; path=/; max-age=31536000`;
            
            // Apply the settings immediately
            applyAccessibilitySettings();
        }
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

    // Pré-visualização em tempo real de modo escuro e alto contraste
    const body = document.body;
    const darkModeCheckbox = document.getElementById('modo-escuro');
    const contrastCheckbox = document.getElementById('alto-contraste');

    function applyAccessibilityPreview() {
        // Modo escuro
        if (darkModeCheckbox && darkModeCheckbox.checked) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        // Alto contraste
        if (contrastCheckbox && contrastCheckbox.checked) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
    }

    if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', applyAccessibilityPreview);
    }
    if (contrastCheckbox) {
        contrastCheckbox.addEventListener('change', applyAccessibilityPreview);
    }

    // Aplicar pré-visualização ao carregar a página
    applyAccessibilityPreview();
});