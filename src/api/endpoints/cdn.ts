import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import memoryCache from '../../utils/memoryCache';
import { generateUniqueFilename } from '../../utils/generateUniqueFilename';

const router = Router();

const upload = multer({
    dest: 'src/uploads/',
});

const serveImage = async (req: Request, res: Response) => {
    const imageKey = req.params.imageName;

    try {
        const cachedImage = memoryCache.get(imageKey);

        if (cachedImage) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(cachedImage);
            return;
        }

        const imagePath = path.join(__dirname, '../../uploads/', imageKey);
        if (fs.existsSync(imagePath)) {
            const image = fs.readFileSync(imagePath);
            memoryCache.set(imageKey, image, 86400);
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(image);
            return;
        } else {
            res.status(404).send('Image not found');
            return;
        }
    } catch (error) {
        console.error('Error while serving image:', error);
        res.status(500).send('Server error');
        return;
    }
};

const deleteImage = async (req: Request, res: Response) => {
    const imageKey = req.params.imageName;

    try {
        const imagePath = path.join(__dirname, '../../uploads/', imageKey);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);

            memoryCache.del(imageKey);

            res.status(200).send('Image deleted successfully');
            return;
        } else {
            res.status(404).send('Image not found');
            return;
        }
    } catch (error) {
        console.error('Error while deleting image:', error);
        res.status(500).send('Server error');
        return;
    }
};

router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).send('No file uploaded');
            return;
        }

        const uniqueFilename = generateUniqueFilename(file.originalname);
        const imageUrl = `/cdn/${uniqueFilename}`;
        res.status(201).send({ imageUrl });
        return;
    } catch (error) {
        console.error('Error during image upload:', error);
        res.status(500).send('Server error');
        return;
    }
});

router.get('/:imageName', serveImage);
router.delete('/:imageName', deleteImage);

export default router;
