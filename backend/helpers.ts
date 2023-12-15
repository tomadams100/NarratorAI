import fs from 'fs';
import path from 'path';
import * as openAiSvc from './openAiSvc';

export async function generateImageDescription(file: Express.Multer.File) {
  const imageBuffer: Buffer = file.buffer;

  const uploadFolderPath = './uploads';
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath);
  }

  const fileName = `photo.jpg`;
  const filePath = `${uploadFolderPath}/${fileName}`;

  fs.writeFileSync(filePath, imageBuffer);

  return await openAiSvc.describeImage(filePath);
}

export async function generateAudio(description: string) {
  await openAiSvc.textToAudio(description);
  return path.resolve('./speech.mp3');
}
