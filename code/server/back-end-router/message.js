import express from "express";
import axios from "axios";
import querystring from "querystring";
import mongoose from "mongoose";
import routeName from "#server/utils/name-route.middleware.js";

const router = express.Router();
const base = "messages";

// Liste messages (admin) -> GET /admin/messages
router.get(`/${base}`, routeName("message_list"), async (req, res) => {
    const queryParams = querystring.stringify({ per_page: 7, ...req.query });

    let result = { data: { data: [], count: 0, total_pages: 1, page: 1, query_params: "" } };

    try {
        const options = {
            method: "GET",
            url: `${res.locals.base_url}/api/${base}?${queryParams}`,
        };
        const response = await axios(options);
        result = response;
    } catch {}

    res.render("pages/back-end/messages/list.njk", {
        list_messages: result.data,
    });
});

// Détail message (admin) -> GET /admin/messages/:id
router.get(`/${base}/:id([a-f0-9]{24})`, routeName("message_detail"), async (req, res) => {
    try {
        // ⚠️ si tu n’as PAS d’API GET /api/messages/:id, enlève cette route pour l’instant
        const options = {
            method: "GET",
            url: `${res.locals.base_url}/api/${base}/${req.params.id}`,
        };
        const result = await axios(options);

        res.render("pages/back-end/messages/detail.njk", {
            message: result.data,
        });
    } catch (error) {
        res.status(404).render("pages/error.njk", {
            error: { message: "Message non trouvé" },
        });
    }
});

export default router;
