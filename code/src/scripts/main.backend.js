import "/src/styles/base.css";
import "/src/styles/scroll-shadow.css";
import "/src/styles/tailwind.css";
import "/src/styles/back-end/index.css";
import "./back-end/delete-entry-modal.js";
import "./back-end/preview-upload.js";
import "./back-end/paste-clipboard-image.js";
import "./back-end/reset-form.js";
import "./back-end/delete-uploaded-image.js";
import "./back-end/drag-n-drop-upload.js";
import "./back-end/close-modal.js";
import "./back-end/preview-modal.js";
import "./back-end/display-pagination-shortcut.js";
import "./back-end/tooltip-manager.js";
import "./back-end/breadcrumb-modal.js";
import "./back-end/flash-message.js";
import "/src/scripts/store-scroll-position.utils";

if (process.env.NODE_ENV === "development") {
    await import("./profiler-bar");
    await import("./vite.error-overlay");
}


const THEME_KEY = "admin-theme";
const DEFAULT_THEME = "blue";

const themeBg = document.querySelector("#admin-theme-bg");
const themeButtons = document.querySelectorAll("[data-theme]");
const metaTheme = document.querySelector('meta[name="theme-color"]');
const menuLinks = document.querySelectorAll("[data-navigation] a");

const THEMES = {

    "black": { bg: "bg-gray-200", text: "text-black", gradient: "from-gray-400", meta: "#9ca3af", btn: "bg-black" },
    "slate": { bg: "bg-slate-100", text: "text-slate-900", gradient: "from-slate-300", meta: "#cbd5e1", btn: "bg-slate-600" },
    "zinc": { bg: "bg-zinc-100", text: "text-zinc-900", gradient: "from-zinc-300", meta: "#d4d4d8", btn: "bg-zinc-600" },
    "gray": { bg: "bg-gray-100", text: "text-gray-900", gradient: "from-gray-300", meta: "#d1d5db", btn: "bg-gray-600" },
    "neutral": { bg: "bg-neutral-100", text: "text-neutral-900", gradient: "from-neutral-300", meta: "#d4d4d4", btn: "bg-neutral-600" },
    "stone": { bg: "bg-stone-100", text: "text-stone-900", gradient: "from-stone-300", meta: "#d6d3d1", btn: "bg-stone-600" },
    "blue-900": { bg: "bg-blue-100", text: "text-blue-900", gradient: "from-blue-400", meta: "#60a5fa", btn: "bg-blue-900" },
    "indigo": { bg: "bg-indigo-50", text: "text-indigo-800", gradient: "from-indigo-200", meta: "#c7d2fe", btn: "bg-indigo-600" },
    "blue": { bg: "bg-blue-50", text: "text-blue-700", gradient: "from-blue-200", meta: "#bfdbfe", btn: "bg-blue-600" },
    "sky": { bg: "bg-sky-50", text: "text-sky-900", gradient: "from-sky-200", meta: "#bae6fd", btn: "bg-sky-600" },
    "cyan": { bg: "bg-cyan-50", text: "text-cyan-800", gradient: "from-cyan-200", meta: "#a5f3fc", btn: "bg-cyan-600" },
    "teal": { bg: "bg-teal-50", text: "text-teal-800", gradient: "from-teal-200", meta: "#99f6e4", btn: "bg-teal-600" },
    "green-900": { bg: "bg-green-100", text: "text-green-900", gradient: "from-green-400", meta: "#4ade80", btn: "bg-green-900" },
    "emerald": { bg: "bg-emerald-50", text: "text-emerald-800", gradient: "from-emerald-200", meta: "#a7f3d0", btn: "bg-emerald-600" },
    "green": { bg: "bg-green-50", text: "text-green-700", gradient: "from-green-200", meta: "#bbf7d0", btn: "bg-green-600" },
    "lime": { bg: "bg-lime-50", text: "text-lime-800", gradient: "from-lime-200", meta: "#d9f99d", btn: "bg-lime-600" },
    "purple-900": { bg: "bg-purple-100", text: "text-purple-900", gradient: "from-purple-400", meta: "#a78bfa", btn: "bg-purple-900" },
    "violet": { bg: "bg-violet-50", text: "text-violet-900", gradient: "from-violet-300", meta: "#ddd6fe", btn: "bg-violet-600" },
    "purple": { bg: "bg-purple-50", text: "text-purple-700", gradient: "from-purple-200", meta: "#e9d5ff", btn: "bg-purple-600" },
    "fuchsia": { bg: "bg-fuchsia-50", text: "text-fuchsia-900", gradient: "from-fuchsia-200", meta: "#f5d0fe", btn: "bg-fuchsia-600" },
    "pink": { bg: "bg-pink-50", text: "text-pink-800", gradient: "from-pink-200", meta: "#fce7f3", btn: "bg-pink-600" },
    "rose": { bg: "bg-rose-50", text: "text-rose-800", gradient: "from-rose-200", meta: "#fecdd3", btn: "bg-rose-600" },
    "red-900": { bg: "bg-red-100", text: "text-red-900", gradient: "from-red-400", meta: "#f87171", btn: "bg-red-900" },
    "red": { bg: "bg-red-50", text: "text-red-700", gradient: "from-red-200", meta: "#fecaca", btn: "bg-red-600" },
    "orange-600": { bg: "bg-orange-100", text: "text-orange-900", gradient: "from-orange-300", meta: "#fdba74", btn: "bg-orange-600" },
    "orange": { bg: "bg-orange-50", text: "text-orange-700", gradient: "from-orange-200", meta: "#fed7aa", btn: "bg-orange-600" },
    "amber": { bg: "bg-amber-50", text: "text-amber-800", gradient: "from-amber-200", meta: "#fde68a", btn: "bg-amber-600" },
    "yellow": { bg: "bg-yellow-50", text: "text-yellow-800", gradient: "from-yellow-200", meta: "#fef9c3", btn: "bg-yellow-500" },
};

function applyTheme(theme) {
    if (!THEMES[theme]) return;
    const t = THEMES[theme];

    // 1. BOUTONS D'INTERFACE (Enregistrer, etc.)
    const actionButtons = document.querySelectorAll('button[type="submit"], .btn-primary, .button-save');
    actionButtons.forEach(btn => {
        // Supprime toutes les classes de boutons définies dans THEMES
        Object.values(THEMES).forEach(th => btn.classList.remove(th.btn));
        // Ajoute la classe du thème actuel
        btn.classList.add(t.btn);
    });

    // 2. DÉGRADÉ DE FOND
    if (themeBg) {
        Object.values(THEMES).forEach(th => themeBg.classList.remove(th.gradient));
        themeBg.classList.add(t.gradient);
    }

    // 3. MENU LATÉRAL
    menuLinks.forEach(link => {
        const isActive = link.classList.contains("active-link");
        Object.values(THEMES).forEach(th => link.classList.remove(th.bg, th.text));
        if (isActive) link.classList.add(t.bg, t.text);
    });

    // 4. STYLE DU SÉLECTEUR
    themeButtons.forEach(btn => {
        const isActive = btn.dataset.theme === theme;
        btn.style.transform = isActive ? "scale(1.3)" : "scale(1)";
        btn.style.outline = isActive ? "2px solid white" : "none";
    });

    // 5. META THEME COLOR
    if (metaTheme) {
        metaTheme.setAttribute("content", t.meta);
    };

    localStorage.setItem(THEME_KEY, theme);
}

// Initialisation et Event Listeners
const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
applyTheme(savedTheme);

themeButtons.forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
});
