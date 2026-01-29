import validator from "validator";
import axios from "axios";

const show = (el) => el && el.classList.remove("hidden");
const hide = (el) => el && el.classList.add("hidden");

const setFeedback = (el, message, variant) => {
    if (!el) return;
    el.textContent = message;
    el.className ="mt-3 text-sm " + (variant === "success" ? "text-green-600" : "text-red-600");
    el.classList.remove("hidden");
};

const submitForm = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);

    // reset erreurs
    form.querySelectorAll("[data-error-message]").forEach((p) => hide(p));

    const feedback = form.querySelector("[data-form-feedback]");
    if (feedback) hide(feedback);

    let hasError = false;

    // Prénom (firstName)
    if (validator.isEmpty((values.firstName || "").trim())) {
        show(form.querySelector("[data-error-message='firstName']"));
        hasError = true;
    }

    // Nom (lastName)
    if (validator.isEmpty((values.lastName || "").trim())) {
        show(form.querySelector("[data-error-message='lastName']"));
        hasError = true;
    }

    // Email
    if (!validator.isEmail(values.email || "")) {
        show(form.querySelector("[data-error-message='email']"));
        hasError = true;
    }

    // Message (message)
    if (validator.isEmpty((values.message || "").trim())) {
        show(form.querySelector("[data-error-message='message']"));
        hasError = true;
    }

    // Radio (je_suis)
    if (!values.je_suis) {
        show(form.querySelector("[data-error-message='je_suis']"));
        hasError = true;
    }

    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
        const url = form.getAttribute("action") || "/api/messages";
        await axios.post(url, values);

        form.reset();
        setFeedback(feedback, "Message envoyé ✅", "success");
    } catch (err) {
        const apiMsg =
            err?.response?.data?.errors?.[0] ||
            "Erreur lors de l’envoi du message ❌";
        setFeedback(feedback, apiMsg, "error");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
};

document.querySelectorAll("[data-async-form]").forEach((form) => {
    form.addEventListener("submit", submitForm);
});
