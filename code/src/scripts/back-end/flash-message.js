const listFlashMessages = document.querySelectorAll("[data-flash-message]");
const DELAY_BEFORE_AUTO_HIDE = 3500;

const respondToVisibility = (element, callback) => {
    const options = {
        root: document.documentElement,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            callback(entry.intersectionRatio > 0);
        });
    }, options);

    observer.observe(element);
};

listFlashMessages.forEach((flashMessage) => {
    respondToVisibility(flashMessage, (isVisible) => {
        if (isVisible) {
            setTimeout(() => {
                flashMessage.classList.add("hidden");
            }, DELAY_BEFORE_AUTO_HIDE);
        }
    });
});
