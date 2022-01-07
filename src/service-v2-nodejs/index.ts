import path from 'path';
import express from 'express';

const app = express();
const port = 30100;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../configuration/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../configuration/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});