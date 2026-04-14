import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
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

// Static folder for professional uploads
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));
console.log('Serving uploads from:', uploadPath);

// Mount the entire public folder of the website at the root
// This will naturally serve /Gallery/..., /pta1.webp, etc.
const publicPath = path.join(process.cwd(), '../../public');
app.use('/', express.static(publicPath));

// Routes Middleware
app.use('/api', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', dynamicRoutes);

app.get('/', (req, res) => {
    res.send('Professional API is running...');
});

// Diagnostic route
import fs from 'fs';
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

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
