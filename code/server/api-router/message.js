import express from "express";
import routeName from "#server/utils/name-route.middleware.js";
import Message from "#models/message.js";
import querystring from "querystring";
import mongoose from "mongoose";


const router = express.Router();
const base = "messages";

router.post(`/${base}`, routeName("message_api"), async (req, res) => {
    let listErrors = [];

    const ressource = new Message(req.body);

    try {
        await ressource.save();
        res.status(201).json(ressource);
    } catch (err) {
        res.status(400).json({
            errors: [
                ...listErrors,
                ...Object.values(
                    err?.errors || [{ message: "Il y a eu un problème" }]
                ).map(val => val.message),
            ],
            ressource: req.body,
        });
    }
});
router.get(`/${base}`, routeName("message_api_get_all"), async (req, res) => {
    try {
        const messages = await Message.find();
        console.log(messages);
        res.json(messages); // la liste avec les messages
    } catch (err) {
        res.status(500).json({ error: "Erreur" }); // si il y a une erreur coté server
    }
});



// get messages
router.get(`/${base}`, routeName("message_api_get_all"), async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    let perPage = Number(req.query.per_page) || 7;
    // Clamps the value between 1 and 20
    perPage = Math.min(Math.max(perPage, 1), 20);

    try {
        const listRessources = await Message.aggregate([
            { $sort: { _id: -1 } },
            { $skip: Math.max(page - 1, 0) * perPage },
            { $limit: perPage },
        ]);

        const count = await Message.countDocuments(
        );

        const queryParam = { ...req.query };
        delete queryParam.page;

        res.status(200).json({
            data: listRessources,
            total_pages: Math.ceil(count / perPage),
            count,
            page,
            query_params: querystring.stringify(queryParam),
        });
    } catch (e) {
        res.status(400).json({
            errors: [
                ...Object.values(
                    e?.errors || [{ message: e?.message || "Il y a eu un problème" }]
                ).map(val => val.message),
            ],
        });
    }
});

export default router;
