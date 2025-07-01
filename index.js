const express = require('express');
const app = express();

// Định nghĩa một route đơn giản
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Server lắng nghe trên cổng 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});