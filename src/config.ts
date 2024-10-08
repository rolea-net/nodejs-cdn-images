import dotenv from 'dotenv';

const env = process.env.NODE_ENV ?? 'development';

if (env === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

export default {
    port: process.env.PORT ?? 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
};
