import "/src/styles/base.css";
import "/src/styles/scroll-shadow.css";
import "/src/styles/tailwind.css";
import "/src/styles/back-end/index.css";

// Import des scripts back-end
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

// ===============================
// ADMIN THEME (localStorage)
// ===============================

const THEME_KEY = "admin-theme";
const DEFAULT_THEME = "blue";

const themeBg = document.querySelector("#admin-theme-bg");
const themeButtons = document.querySelectorAll("[data-theme]");
const metaTheme = document.querySelector('meta[name="theme-color"]');

const menuLinks = document.querySelectorAll("[data-navigation] a");

// Mapping thème → classes Tailwind
const THEMES = {
    "blue": {
        bg: "bg-blue-50",
        hover: "hover:bg-blue-100",
        text: "text-blue-700",
        gradient: "from-blue-200",
        meta: "#bfdbfe",
        btn: "bg-blue-500 text-white hover:bg-blue-600",
    },
    "green": {
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
        text: "text-green-700",
        gradient: "from-green-200",
        meta: "#bbf7d0",
        btn: "bg-green-500 text-white hover:bg-green-600",
    },
    "red": {
        bg: "bg-red-50",
        hover: "hover:bg-red-100",
        text: "text-red-700",
        gradient: "from-red-200",
        meta: "#fecaca",
        btn: "bg-red-500 text-white hover:bg-red-600",
    },
    "purple": {
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
        text: "text-purple-700",
        gradient: "from-purple-200",
        meta: "#e9d5ff",
        btn: "bg-purple-500 text-white hover:bg-purple-600",
    },
    "orange": {
        bg: "bg-orange-50",
        hover: "hover:bg-orange-100",
        text: "text-orange-700",
        gradient: "from-orange-200",
        meta: "#fed7aa",
        btn: "bg-orange-500 text-white hover:bg-orange-600",
    },
    "pink": {
        bg: "bg-pink-50",
        text: "text-pink-800",
        hover: "hover:bg-pink-100",
        gradient: "from-pink-200",
        meta: "#fbcfe8",
        btn: "bg-pink-500 text-white hover:bg-pink-600",
    },
    "teal": {
        bg: "bg-teal-50",
        text: "text-teal-800",
        hover: "hover:bg-teal-100",
        gradient: "from-teal-200",
        meta: "#99f6e4",
        btn: "bg-teal-500 text-white hover:bg-teal-600",
    },
    "indigo": {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        hover: "hover:bg-indigo-100",
        gradient: "from-indigo-200",
        meta: "#c7d2fe",
        btn: "bg-indigo-500 text-white hover:bg-indigo-600",
    },
    "yellow": {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        hover: "hover:bg-yellow-100",
        gradient: "from-yellow-200",
        meta: "#fef9c3",
        btn: "bg-yellow-500 text-white hover:bg-yellow-600",
    },
    "cyan": {
        bg: "bg-cyan-50",
        text: "text-cyan-800",
        hover: "hover:bg-cyan-100",
        gradient: "from-cyan-200",
        meta: "#a5f3fc",
        btn: "bg-cyan-500 text-white hover:bg-cyan-600",
    },

    "lime": {
        bg: "bg-lime-50",
        text: "text-lime-800",
        hover: "hover:bg-lime-100",
        gradient: "from-lime-200",
        meta: "#d9f99d",
        btn: "bg-lime-500 text-white hover:bg-lime-600",
    },
    "amber": {
        bg: "bg-amber-50",
        text: "text-amber-800",
        hover: "hover:bg-amber-100",
        gradient: "from-amber-200",
        meta: "#fde68a",
        btn: "bg-amber-500 text-white hover:bg-amber-600",
    },
    "rose": {
        bg: "bg-rose-50",
        text: "text-rose-800",
        hover: "hover:bg-rose-100",
        gradient: "from-rose-200",
        meta: "#fecdd3",
        btn: "bg-rose-500 text-white hover:bg-rose-600",
    },
    "orange-600": {
        bg: "bg-orange-100",
        text: "text-orange-900",
        hover: "hover:bg-orange-200",
        gradient: "from-orange-300",
        meta: "#fdba74",
        btn: "bg-orange-600 text-white hover:bg-orange-700",
    },
};


function applyTheme(theme) {
    if (!THEMES[theme]) return;

    const t = THEMES[theme];

    // Dégradé de fond
    if (themeBg) {
        Object.values(THEMES).forEach(th => themeBg.classList.remove(th.gradient));
        themeBg.classList.add(t.gradient);
    }

    // Meta theme-color
    if (metaTheme) metaTheme.setAttribute("content", t.meta);

    // Menu
    menuLinks.forEach(link => {
        const isActive = link.classList.contains("font-bold"); // ou autre indicateur actif
        // Supprimer anciennes classes de couleur d'item actif
        Object.values(THEMES).forEach(th => {
            link.classList.remove(th.bg, th.text);
        });
        if (isActive) {
        // Appliquer la couleur de fond et texte seulement à l'item actif
            link.classList.add(t.bg, t.text);
        }
    });
    localStorage.setItem(THEME_KEY, theme);
}

// Appliquer au chargement
const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
applyTheme(savedTheme);

// Clic sur les boutons
themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        applyTheme(btn.dataset.theme);
    });
});
