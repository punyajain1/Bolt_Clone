import express, { Request, Response } from "express";
import OpenAI from "openai";
import { base_prompts, main_prompts } from "./promts";
import { node_base_promt } from "./default/node";
import { ract_base_promt } from "./default/react";
import cors from "cors";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const client = new OpenAI({
    apiKey: process.env["AI_API_KEY"]
});

app.post("/tamplet", async (req, res) => {
    const promt = req.body.promt;
    const response = await client.chat.completions.create({
        messages: [
            {
                role:"system",
                content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
            },
            {
                role:"user",
                content: promt
            }
        ],
        model: "meta-llama/llama-4-maverick:free",
        temperature: 1,
        max_tokens: 200
      });
      const answer = response.choices[0].message.content;
      if(answer === "node"){
        res.send({
            promt: [base_prompts, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_base_promt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uipromt:[node_base_promt]
        })
      }
      if(answer === "react"){
        res.send({
            promt: [base_prompts, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ract_base_promt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uipromt:[ract_base_promt]
        })
      }
    
});



app.post("/chat", async (req: Request, res: Response) => {
    try {
        const userMessage = req.body.message;
        if (!Array.isArray(userMessage)) {
            res.status(400).json({ error: "Invalid request: 'message' must be an array." });
        }
        interface ChatMessage {
            role: string;
            content: string;
        }

        const isValidMessageArray: boolean = (userMessage as ChatMessage[]).every(
            (msg: ChatMessage) =>
                msg &&
                typeof msg === "object" &&
                typeof msg.role === "string" &&
                typeof msg.content === "string"
        );

        if (!isValidMessageArray) {
            res.status(400).json({
                error: "Invalid request: each message must have 'role' and 'content' properties as strings.",
            });
        }

        const response = await client.chat.completions.create({
            messages: [{
                role: "system",
                content: main_prompts,
            },
                ...userMessage,
            ],
            model: "meta-llama/llama-4-maverick:free",
            temperature: 0.5,
            max_tokens: 4096,
        });

        const answer = response.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error("Error during OpenAI API call:", error);
        res.status(500).json({ error: "An error occurred during the API call." });
    }
});

app.listen(3000);

