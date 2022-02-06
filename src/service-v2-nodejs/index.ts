import path from 'path';
import express from 'express';
import helmet from 'helmet';

import { registerInfoApi } from './src/api/v2/info';

import { uploadModule } from './update-module';

const app = express();
const port = 30100;

// Upload module file
uploadModule(path.join(__dirname, '../../..', 'iotemplate.zip'), process.env.PROJECT_SERVICE, process.env.UPLOAD_TOKEN);

app.use(express.json({ limit: '100mb' })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/** Adding helmet for security settings */
app.use(helmet());

/** Rules */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authoriztaion');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE');
        return res.status(200).json({});
    }

    next();
});

// Register API's
registerInfoApi(app);

// Serve the static files from the React app
if (process.env.NODE_DEV === 'development') {
    app.use(express.static(path.join(__dirname, '..', 'configuration/build')));
} else {
    app.use(express.static(path.join(__dirname, '../../..', 'build')));
}

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    // Set content security policy to execute scripts
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'; font-src 'self' http://* data: fonts.gstatic.com;");

    if (process.env.NODE_DEV === 'development') {
        res.sendFile(path.join(__dirname, '..', 'configuration/build/index.html'));
    } else {
        res.sendFile(path.join(__dirname, '../../..', 'build/index.html'));
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});