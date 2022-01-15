import express from 'express';
import path from 'path';
const __dirname = path.resolve();
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});