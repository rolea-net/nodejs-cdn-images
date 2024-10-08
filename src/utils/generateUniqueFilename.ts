import crypto from 'crypto';
import path from 'path';

export const generateUniqueFilename = (originalName: string): string => {
    const fileExtension = path.extname(originalName);
    const randomString = crypto.randomBytes(6).toString('hex');
    const timestamp = Date.now();
    const baseName = path.basename(originalName, fileExtension);
    const uniqueFilename = `${baseName}_${timestamp}_${randomString}${fileExtension}`;
    return uniqueFilename;
};
