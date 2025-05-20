// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Handle toast notifications
document.addEventListener('DOMContentLoaded', function() {
    const toast = document.querySelector('.toast');
    if (toast) {
        // Show toast with animation
        setTimeout(() => { 
            toast.classList.add('show');
            
            // Create and play audio feedback for screen readers
            const audio = new Audio();
            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fd3x5eG1pam9ycm9tamtvbmxqaWlnZ2VjYV9dW1lYVlVTUU9OTEpJR0ZFRENCQUA/Pj08Ozk3NjU0MzIyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAAAAAAgMEBQYICQoMDQ8QEhMUFhcZGhweHyEjJSYoKissLS8xMzU3OTs9P0FCREZISktNT1BSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PT07OTc1My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampmWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAACAAA==';
            
            try {
                // Play the sound
                audio.play();
            } catch (error) {
                console.log("Audio playback failed:", error);
            }

            // Remove toast after delay
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300); // Wait for fade out animation
            }, 3000);
        }, 100); // Small delay to ensure animation plays
    }
});

// Global function to show toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    const icon = type === 'success' ? 'check-circle-fill' : 'info-circle-fill';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${icon} me-2"></i>
                <span>${message}</span>
            </div>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
        
        // Create and play audio feedback
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fd3x5eG1pam9ycm9tamtvbmxqaWlnZ2VjYV9dW1lYVlVTUU9OTEpJR0ZFRENCQUA/Pj08Ozk3NjU0MzIyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAAAAAAgMEBQYICQoMDQ8QEhMUFhcZGhweHyEjJSYoKissLS8xMzU3OTs9P0FCREZISktNT1BSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PT07OTc1My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampmWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAAAAAQIDBAYHCQoMDg8RExQWGBkaHB4gIiQlJygqLC0vMTM1Nzk7PT9BQ0VHSUtNT1FSVFZYWlxeYGJkZmhqbG5wcnR2eHp8fn+BgoSFhoeIiYqLjI2Oj5CQkZKTk5SUlZWWlpeXmJiZmZqampubm5ycnZ2dnp6en5+goKGhoqKjo6SkpaWmpqenp6anp6ampqWlpKSjo6KioaCgn5+enp2dnJycm5ubmpqZmZmYmJeXl5aWlZWUlJOTkpKRkZCQj4+Ojo2Mi4qJiIeGhYSCgYB+fHp4dnRycG5sa2lnZWNhX11bWVdVU1FQTE1LSUdFQ0E/PTw6ODY0My8tLCopJyUkIiAfHRsaGBYVExEQDgwLCQgGBQMCAACAAA==';
        
        try {
            audio.play();
        } catch (error) {
            console.log("Audio playback failed:", error);
        }

        // Remove toast after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300); // Wait for fade out animation
        }, 3000);
    }, 100);
}
