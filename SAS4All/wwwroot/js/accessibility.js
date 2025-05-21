// Acessibilidade global: aplica dark mode, alto contraste e tamanho de fonte em todas as páginas

function toggleDarkMode(enabled) {
    const highContrastCheckbox = document.getElementById('alto-contraste');
    if (enabled && !(highContrastCheckbox && highContrastCheckbox.checked)) {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.removeAttribute('data-theme');
    }
}

function toggleHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
        document.body.classList.remove('dark-mode'); // Alto contraste tem prioridade
        document.documentElement.setAttribute('data-contrast', 'high');
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.body.classList.remove('high-contrast');
        document.documentElement.removeAttribute('data-contrast');
        // Restaura o modo escuro se estiver ativo
        const darkModeCheckbox = document.getElementById('modo-escuro');
        if (darkModeCheckbox && darkModeCheckbox.checked) {
            document.body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}

function applyThemeFromStorageAndSyncCheckboxes() {
    const dark = localStorage.getItem('darkMode') === 'true';
    const contrast = localStorage.getItem('highContrast') === 'true';
    const darkModeCheckbox = document.getElementById('modo-escuro');
    const highContrastCheckbox = document.getElementById('alto-contraste');
    if (darkModeCheckbox) darkModeCheckbox.checked = dark;
    if (highContrastCheckbox) highContrastCheckbox.checked = contrast;
    toggleDarkMode(dark);
    toggleHighContrast(contrast);
}

// Função para aplicar apenas o tema (sem sincronizar checkboxes)
function applyThemeFromStorage() {
    const dark = localStorage.getItem('darkMode') === 'true';
    const contrast = localStorage.getItem('highContrast') === 'true';
    toggleDarkMode(dark);
    toggleHighContrast(contrast);
}

document.addEventListener('DOMContentLoaded', function() {
    // Aplica tema salvo SEMPRE ao carregar
    applyThemeFromStorageAndSyncCheckboxes();

    // Listeners para persistir alterações no localStorage (se checkboxes existirem)
    const darkModeCheckbox = document.getElementById('modo-escuro');
    const highContrastCheckbox = document.getElementById('alto-contraste');
    if (darkModeCheckbox) {
        darkModeCheckbox.addEventListener('change', function() {
            localStorage.setItem('darkMode', this.checked);
            if (!(highContrastCheckbox && highContrastCheckbox.checked)) {
                toggleDarkMode(this.checked);
            }
            document.dispatchEvent(new CustomEvent('accessibilitySettingsChanged'));
        });
    }
    if (highContrastCheckbox) {
        highContrastCheckbox.addEventListener('change', function() {
            localStorage.setItem('highContrast', this.checked);
            toggleHighContrast(this.checked);
            document.dispatchEvent(new CustomEvent('accessibilitySettingsChanged'));
        });
    }

    // Reaplica tema após pop-up de sucesso (caso haja reload ou AJAX)
    document.addEventListener('accessibilitySettingsSaved', function() {
        applyThemeFromStorageAndSyncCheckboxes();
    });

    // Garante que o tema é reaplicado sempre que as definições mudam
    document.addEventListener('accessibilitySettingsChanged', function() {
        if (typeof applyThemeFromStorage === 'function') {
            applyThemeFromStorage();
        }
    });
});