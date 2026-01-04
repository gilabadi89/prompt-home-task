import express from 'express';
import multer from 'multer';
import cors from 'cors';
import {processPdfFiles} from "./services/file-inspector-service";

const app = express();
const upload = multer();

app.use(cors()); // Allow the extension to talk to the server
app.use(express.json());

app.post('/inspect-pdf', upload.array('files'), async (req, res) => {
    const files = req.files as Express.Multer.File[];
    const results = await processPdfFiles(files);

    res.json({ results });
});

app.listen(3000, () => console.log('Security Server running on port 3000'));