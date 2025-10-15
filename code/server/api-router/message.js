import express from "express";
import mongoose from "mongoose";

import routeName from "#server/utils/name-route.middleware.js";
import Message from "#models/message.js";

const router = express.Router();

const base = "messages";

router.post(`/${base}`, routeName("message_api"), upload.single("image"), async (req, res) => {
    let listErrors = [];

    const uploadedImage = req.body.file || req.file;

    if (listErrors.length) {
        return res.status(400).json({
            errors: listErrors,
            ressource: req.body,
        });
    }

    const ressource = new Message(req.body);
    try {
        await ressource.save();
        res.status(201).json(ressourceComputed);
    } catch (error) {
        res.status(400).json({
            errors: [
                ...listErrors,
                ...deleteUpload(targetPath),
                ...Object.values(
                    error?.errors || [{ message: "Il y a eu un problème" }]
                ).map(val => val.message),
            ],
        });
    }
});