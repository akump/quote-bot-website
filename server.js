import express from 'express';
import {
    resolve
} from 'path';
const app = express();
const port = 5001;

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, 'public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});