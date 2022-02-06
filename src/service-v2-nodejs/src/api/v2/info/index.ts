import { Express } from 'express';

import path from 'path';
import fs from 'fs';

export function registerInfoApi(app: Express) {
    app.get('/api/v2/info', async (req, res) => {
        res.status(200).send({
            product: 'ACTIWARE: IO',
            product_name: 'Module: IOTemplate',
            product_version: '2.0.0',
            file_version: '2.0.0',
            stratus: true
        });
    });

    app.get('/api/v2/info/module', async (req, res) => {
        try {
            const file = path.join(__dirname, '../../..', 'module-definition/info.json');

            if (fs.existsSync(file) === true) {
                const buffer = fs.readFileSync(file);

                res.status(200).send(buffer.toString());
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).send(JSON.stringify(error));
        }
    });

    app.get('/api/v2/info/module/download', async (req, res) => {
        try {
            const file = path.join(__dirname, '../../..', 'iotemplate.zip');

            if (fs.existsSync(file) === true) {
                res.download(file);
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(500).send(JSON.stringify(error));
        }
    });
}