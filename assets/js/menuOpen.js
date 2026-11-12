// Mobile menu: the burger button opens and closes the full-screen menu.
// aria-expanded and the label tell screen readers the current state;
// Escape closes the menu and returns focus to the button.
export default function menuOpen() {
    const burger = document.querySelector('.gh-burger');
    if (!burger) return;

    const setOpen = (open) => {
        document.body.classList.toggle('gh-head-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    burger.addEventListener('click', () => {
        setOpen(!document.body.classList.contains('gh-head-open'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('gh-head-open')) {
            setOpen(false);
            burger.focus();
        }
    });
}
