import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router(); // ✅ OBLIGATOIRE

const filePath = path.resolve("src/data/open-day.json");

// GET – afficher la page admin
router.get("/", async (req, res) => {
    let open_day = { date: "" };

    try {
        const file = await fs.readFile(filePath, "utf-8");
        open_day = JSON.parse(file).open_day;
    } catch (err) {
        console.error("Erreur lecture open-day.json :", err);
    }

    res.render("pages/back-end/open-day.njk", {
        open_day,
        active_menu_item: "open-day",
    });
});

// POST – enregistrer la date
router.post("/", async (req, res) => {
    const { date } = req.body;

    const data = {
        open_day: { date },
    };

    await fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
    );

    req.flash("success", "Date enregistrée");
    res.redirect("/admin/open-day");
});

export { router }; // ✅ maintenant router existe
