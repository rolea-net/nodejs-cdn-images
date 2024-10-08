import { Router, Request, Response } from 'express';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const api = Router();
api.use(bodyParser.json());

function loadEndpoints(dir: string): void {
    const endpoints = readdirSync(dir);
    for (const endpoint of endpoints) {
        const filepath = path.join(dir, endpoint);

        if (statSync(filepath).isDirectory()) {
            loadEndpoints(filepath);
        } else if (filepath.endsWith('.ts') || filepath.endsWith('.js')) {
            try {
                const router = require(filepath).default;
                api.use(router);
                console.log(`Loading endpoint: ${filepath}`);
            } catch (error) {
                console.error(`Error while loading endpoint: ${filepath}`, error);
            }
        }
    }
}

loadEndpoints(path.join(__dirname, 'endpoints'));

api.use((req: Request, res: Response) => {
    res.status(404).json({
        error: true,
        message: `Cannot ${req.method} ${req.path}`
    });
});

export default api;
