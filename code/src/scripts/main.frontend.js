import "/src/styles/base.css";
import "/src/styles/hero.css";
import "/src/styles/index.css";
import "/src/styles/tailwind.css";
import "/src/styles/scroll-shadow.css";

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
