import express, { Application } from 'express';
import config from './config';
import api from './api/load';
import memoryCache from './utils/memoryCache';
import path from 'path';

memoryCache.preloadImages(path.join(__dirname, 'uploads'));

const app: Application = express()
    .set('port', config.port)
    .use(express.json())
    .use('/attachments', api)

app.listen(app.get('port'), () => {
    console.log(`Server is running on ${app.get('port')}`);
});
