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

// Static folder for professional uploads
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));
console.log('Serving uploads from:', uploadPath);

// Mount the entire public folder of the website at the root
// Using absolute path resolving to ensure it works on Render
const repoRoot = path.resolve(__dirname, '../../../');
const publicPath = path.join(repoRoot, 'public');
console.log('Mounting website public folder from:', publicPath);
app.use('/', express.static(publicPath));
app.use('/Gallery', express.static(path.join(publicPath, 'Gallery')));
app.use('/uploads/Gallery', express.static(path.join(publicPath, 'Gallery')));
// Also alias root images like pta1.webp if they were uploaded to /uploads/
app.use('/uploads', express.static(path.join(publicPath))); 
app.use('/uploads', express.static(uploadPath)); // Keep original uploads too

// Routes Middleware
app.use('/api', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', dynamicRoutes);

app.get('/', (req, res) => {
    res.send('Professional API is running...');
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

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
