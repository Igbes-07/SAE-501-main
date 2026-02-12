import express from "express";
import routeName from "#server/utils/name-route.middleware.js";
import Message from "#models/message.js";
import querystring from "querystring";

const router = express.Router();
const base = "messages";

// CREATE
router.post(`/${base}`, routeName("message_api_create"), async (req, res) => {
    try {
        const ressource = new Message(req.body);
        await ressource.save();
        res.status(201).json(ressource);
    } catch (err) {
        res.status(400).json({
            errors: Object.values(err?.errors || [{ message: "Il y a eu un problème" }]).map(
                (val) => val.message
            ),
            ressource: req.body,
        });
    }
});

// READ (paginated)
router.get(`/${base}`, routeName("message_api_list"), async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    let perPage = Number(req.query.per_page) || 7;
    perPage = Math.min(Math.max(perPage, 1), 20);

    try {
        const listRessources = await Message.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const count = await Message.countDocuments();

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
            errors: [e?.message || "Il y a eu un problème"],
        });
    }
});

export default router;
