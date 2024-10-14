import fs from 'fs';
import path from 'path';

interface CacheEntry {
    data: Buffer;
    expiresAt: number;
}

class MemoryCache {
    private cache: Record<string, CacheEntry> = {};

    set(key: string, data: Buffer, ttl: number) {
        const expiresAt = Date.now() + ttl * 1000;
        this.cache[key] = { data, expiresAt };
    }

    get(key: string): Buffer | null {
        const entry = this.cache[key];
        if (entry) {
            if (Date.now() < entry.expiresAt) {
                return entry.data;
            } else {
                delete this.cache[key];
            }
        }
        return null;
    }

    del(key: string): boolean {
        if (this.cache[key]) {
            delete this.cache[key];
            return true;
        } else {
            return false;
        }
    }

    preloadImages(directory: string) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.preloadImages(filePath);
            } else if (fs.statSync(filePath).isFile()) {
                const image = fs.readFileSync(filePath);
                this.set(file, image, 86400);
                console.log(`Image ${file} preloaded in cache`);
            }
        }
    }
}

const memoryCache = new MemoryCache();
export default memoryCache;