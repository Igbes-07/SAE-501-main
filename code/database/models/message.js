import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { errorRequiredMessage } from "#database/error-messages.js";

const messageSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, errorRequiredMessage("un prénom")],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, errorRequiredMessage("un nom")],
            trim: true,
        },
        message: {
            type: String,
            required: [true, errorRequiredMessage("un message")],
            maxlength: [200, 'Le champ "message" ne peut pas dépasser 200 caractères'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, errorRequiredMessage("un email")],
            trim: true,
            lowercase: true,
            validate: {
                validator: (v) => validator.isEmail(v || ""),
                message: "Veuillez mettre un email valide.",
            },
        },
        je_suis: {
            type: String,
            enum: ["non_precise", "etudiant", "parent", "autre"],
            default: "non_precise",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
