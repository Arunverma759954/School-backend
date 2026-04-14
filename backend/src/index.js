import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import dynamicRoutes from './routes/dynamicRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes Middleware
app.use('/api', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', dynamicRoutes);

// Static folder for professional uploads (ONLY ONE)
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));

// 👉 Legacy Gallery assets (now bundled in uploads for portability)
// This ensures images work in production Vercel environments
const galleryPath = path.join(uploadPath, 'Gallery');
app.use('/Gallery', express.static(galleryPath));

app.get('/', (req, res) => {
    res.send('Professional API is running... v15 STABLE - PROPER DEPLOY');
});

// Diagnostic route
app.get('/api/debug-files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadPath);
        const galleryFiles = fs.existsSync(path.join(uploadPath, 'Gallery')) 
            ? fs.readdirSync(path.join(uploadPath, 'Gallery'))
            : 'Gallery folder MISSING';
        res.json({
            uploadPath,
            files,
            galleryFiles
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

export default app;
