"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const unpdf_1 = require("unpdf");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
app.use((0, cors_1.default)()); // Allow the extension to talk to the server
app.use(express_1.default.json());
app.post('/inspect-pdf', upload.array('files'), async (req, res) => {
    const files = req.files;
    const results = [];
    for (const file of files) {
        // 1. Extract Text
        const { text } = await (0, unpdf_1.extractText)(file.buffer);
        // 2. Perform Security Check (Replace with your logic)
        const isSafe = !text.includes("SECRET_KEY_PROMPT");
        results.push({
            fileName: file.originalname,
            isSafe: isSafe,
            reason: isSafe ? "" : "Sensitive keywords detected in PDF content."
        });
    }
    res.json({ results });
});
app.listen(3000, () => console.log('Security Server running on port 3000'));
