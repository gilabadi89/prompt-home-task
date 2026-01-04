"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const file_inspector_service_1 = require("./services/file-inspector-service");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
app.use((0, cors_1.default)()); // Allow the extension to talk to the server
app.use(express_1.default.json());
app.post('/inspect-pdf', upload.array('files'), async (req, res) => {
    const files = req.files;
    const results = await (0, file_inspector_service_1.processPdfFiles)(files);
    res.json({ results });
});
app.listen(3000, () => console.log('Security Server running on port 3000'));
