import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import cors from 'cors';
import { createServer } from 'http';
import * as helpers from './helpers';

const app = express();
app.use(cors());
const port = 3001;

const server = createServer(app);

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

app.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const description = await helpers.generateImageDescription(req.file!);

      if (!description) {
        res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
        return;
      }

      const audio = await helpers.generateAudio(description);

      res.sendFile(audio);
    } catch (error) {
      console.error('Error handling image upload:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
