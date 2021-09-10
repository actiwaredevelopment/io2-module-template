import express from 'express';

const app = express();
const port = ?????;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});