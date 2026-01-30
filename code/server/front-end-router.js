import express from "express";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

import routeName from "#server/utils/name-route.middleware.js";
import parseManifest from "#server/utils/parse-manifest.js";

const openDayFilePath = path.resolve("src/data/open-day.json");

const router = express.Router();

router.use(async (_req, res, next) => {
    const originalRender = res.render;
    res.render = async function (view, local, callback) {
        const manifest = {
            manifest: await parseManifest("frontend.manifest.json"),
        };

        const args = [view, { ...local, ...manifest }, callback];
        originalRender.apply(this, args);
    };

    next();
});

// ✅ HOME — lecture dynamique de open-day.json + pagination
router.get("/", routeName("homepage"), async (req, res) => {
    let open_day = null;

    try {
        const file = await fs.readFile(openDayFilePath, "utf-8");
        open_day = JSON.parse(file).open_day;
    } catch (err) {
        console.error("Erreur lecture open-day.json :", err);
    }

    // ✅ pagination
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const per_page = 6;

    // ✅ on reconstruit proprement les query params
    const params = new URLSearchParams(req.query);
    params.set("page", page);
    params.set("per_page", per_page);
    params.set("is_active", "true");

    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/articles?${params.toString()}`,
    };

    let result = { data: { data: [], page: 1, total_pages: 1, count: 0 } };

    try {
        result = await axios(options);
    } catch (e) {
        console.error("Erreur API articles :", e?.response?.data || e.message);
    }

    res.render("pages/front-end/index.njk", {
        list_articles: result.data,
        open_day,
    });
});


// "(.html)?" makes ".html" optional in the url
router.get("/a-propos(.html)?", routeName("about"), async (_req, res) => {
    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/saes?per_page=9`,
    };

    let result = {};
    try {
        result = await axios(options);
    } catch (_error) {}

    res.render("pages/front-end/about.njk", {
        list_saes: result.data,
    });
});

router.get("/lieux-de-vie", routeName("places"), async (_req, res) => {
    res.render("pages/front-end/lieux-de-vie.njk");
});

router.get("/sur-les-medias", async (req, res) => {
    res.render("pages/front-end/sur-les-medias.njk");
});

// Route Contact
router.get("/contact(.html)?", routeName("contact"), async (_req, res) => {
    res.render("pages/front-end/contact.njk");
});

// Page d'un article précis
router.get("/article/:id", routeName("article_show"), async (req, res) => {
    let article = {};
    let listErrors = [];

    try {
        const options = {
            method: "GET",
            url: `${res.locals.base_url}/api/articles/${req.params.id}`,
        };
        const result = await axios(options);
        article = result.data;
    } catch (e) {
        listErrors = e?.response?.data?.errors || ["Une erreur est survenue"];
    }

    if (!article || !article._id) {
        return res.status(404).render("pages/front-end/404.njk", {
            title: "Article introuvable",
        });
    }

    res.render("pages/front-end/article.njk", {
        article,
        list_errors: listErrors,
    });
});

router.get("/author/:id", routeName("author"), async (req, res) => {
    let result = {};
    let listErrors = [];

    try {
        const options = {
            method: "GET",
            url: `${res.locals.base_url}/api/authors/${req.params.id}`,
        };
        result = await axios(options);
    } catch (error) {
        listErrors = error.response?.data?.errors || ["Une erreur est survenue"];
    }

    if (!result.data && listErrors.length) {
        // Auteur introuvable → 404 propre
        return res.status(404).render("pages/front-end/404.njk", {
            title: "Auteur introuvable",
        });
    }

    res.render("pages/front-end/auteurs.njk", {
        author: result.data,
        list_errors: listErrors,
    });
});
// Doit être la DERNIÈRE route
router.use((req, res) => {
    res.status(404).render("pages/front-end/404.njk", {
        title: "Page non trouvée",
    });
});

export default router;
