"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const promts_1 = require("./promts");
const node_1 = require("./default/node");
const react_1 = require("./default/react");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const client = new openai_1.default({
    baseURL: process.env["BASE_URL"],
    apiKey: process.env["AI_API_KEY"]
});
app.post("/tamplet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promt = req.body.promt;
    const response = yield client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
            },
            {
                role: "user",
                content: promt
            }
        ],
        model: "meta-llama/llama-4-maverick:free",
        temperature: 1,
        max_tokens: 200
    });
    const answer = response.choices[0].message.content;
    if (answer === "node") {
        res.send({
            promt: [promts_1.base_prompts, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.node_base_promt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uipromt: [node_1.node_base_promt]
        });
    }
    if (answer === "react") {
        res.send({
            promt: [promts_1.base_prompts, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.ract_base_promt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uipromt: [react_1.ract_base_promt]
        });
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userMessage = req.body.message;
        if (!Array.isArray(userMessage)) {
            res.status(400).json({ error: "Invalid request: 'message' must be an array." });
        }
        const isValidMessageArray = userMessage.every((msg) => msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string");
        if (!isValidMessageArray) {
            res.status(400).json({
                error: "Invalid request: each message must have 'role' and 'content' properties as strings.",
            });
        }
        const response = yield client.chat.completions.create({
            messages: [{
                    role: "system",
                    content: promts_1.main_prompts,
                },
                ...userMessage,
            ],
            model: "meta-llama/llama-4-maverick:free",
            temperature: 0.5,
            max_tokens: 4096,
        });
        const answer = response.choices[0].message.content;
        res.json({ answer });
    }
    catch (error) {
        console.error("Error during OpenAI API call:", error);
        res.status(500).json({ error: "An error occurred during the API call." });
    }
}));
app.listen(3000);
