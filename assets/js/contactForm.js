// Contact form: sends the message to Formspree without leaving the page and
// shows the result under the button. Without JavaScript the form still posts
// normally and Formspree shows its own thank-you page.
export default function contactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const status = form.querySelector('.gh-contact-status');
    let sending = false;

    const show = (state, message) => {
        status.dataset.state = state;
        status.textContent = message;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (sending) return;

        sending = true;
        form.classList.add('loading');
        show('', '');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                form.reset();
                show('success', 'Thanks, your message is on its way. I’ll reply as soon as I can.');
            } else {
                const data = await response.json().catch(() => ({}));
                const detail = data.errors?.map((error) => error.message).join(' ');
                show('error', detail
                    ? `That didn’t send: ${detail}`
                    : 'That didn’t send. Please try again in a moment.');
            }
        } catch {
            show('error', 'That didn’t send. Check your connection and try again.');
        } finally {
            sending = false;
            form.classList.remove('loading');
        }
    });
}
