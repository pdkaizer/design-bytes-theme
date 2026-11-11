// Light / dark mode toggle.
// With no saved choice the theme follows the OS (no data-theme attribute).
// A click pins the opposite of the current mode and remembers it.
// partials/theme-init.hbs applies the saved choice before first paint.

const STORAGE_KEY = 'design-bytes-theme';

export default function themeToggle() {
    const buttons = document.querySelectorAll('.gh-theme-toggle');
    if (!buttons.length) return;

    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const currentMode = () => root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
    const otherMode = () => (currentMode() === 'dark' ? 'light' : 'dark');

    const syncLabels = () => {
        const label = `Switch to ${otherMode()} mode`;
        buttons.forEach((button) => {
            button.setAttribute('aria-label', label);
            button.title = label;
        });
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const next = otherMode();
            root.dataset.theme = next;
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch (e) {
                // Storage blocked (private mode etc.): the choice lasts for this page only.
            }
            syncLabels();
        });
    });

    // Keep the label right when the OS mode changes and nothing is pinned.
    prefersDark.addEventListener('change', syncLabels);
    syncLabels();
}
