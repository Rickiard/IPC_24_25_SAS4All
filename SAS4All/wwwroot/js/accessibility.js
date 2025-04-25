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
                document.body.classList.add('voice-command-active');
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
                document.body.classList.remove('voice-command-active');
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

    // Register common shortcuts
    keyboardHandler.registerShortcut('h', () => {
        window.location.href = '/Home';
    });

    keyboardHandler.registerShortcut('a', () => {
        window.location.href = '/Accessibility';
    });

    keyboardHandler.registerShortcut('p', () => {
        window.location.href = '/Account/Profile';
    });

    // Apply saved settings
    const bodyClasses = document.body.className;
    if (bodyClasses.includes('dark-mode')) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (bodyClasses.includes('high-contrast')) {
        document.documentElement.setAttribute('data-contrast', 'high');
    }

    // Register voice commands
    voiceHandler.registerCommand('início', () => window.location.href = '/Home');
    voiceHandler.registerCommand('acessibilidade', () => window.location.href = '/Accessibility');
    voiceHandler.registerCommand('perfil', () => window.location.href = '/Account/Profile');
    voiceHandler.registerCommand('movimentos', () => window.location.href = '/Transactions');
    voiceHandler.registerCommand('refeições', () => window.location.href = '/Meals');
    voiceHandler.registerCommand('carregamentos', () => window.location.href = '/Charging');

    // Make voiceHandler available globally
    window.voiceHandler = voiceHandler;
}); 