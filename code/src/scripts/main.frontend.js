import "/src/styles/base.css";
import "/src/styles/hero.css";
import "/src/styles/index.css";
import "/src/styles/tailwind.css";
import "/src/styles/scroll-shadow.css";
import "./async-form.js";

import axios from "axios";


import "./store-scroll-position.utils";
if (process.env.NODE_ENV === "development") {
    await import("./profiler-bar");
    await import("./vite.error-overlay");
}

const htmlBGColor = window
    .getComputedStyle(document.documentElement, null)
    .getPropertyValue("background-color");
document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", htmlBGColor);

// ==============================
// CONTACT FORM 
// ==============================

const contactForm = document.querySelector("#contact-form");
const feedbackEl = document.querySelector("#contact-feedback");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // empêche le rechargement de page

        const formData = new FormData(contactForm);

        try {
            await axios.post("/api/messages", Object.fromEntries(formData));

            feedbackEl.textContent
            = "Message envoyé avec succès ✅";
            feedbackEl.className
            = "text-sm text-green-600";
            contactForm.reset();
        } catch (error) {
            feedbackEl.textContent
            = "Une erreur est survenue. Réessayez plus tard.";
            feedbackEl.className
            = "text-sm text-red-600";
        }
    });
}
