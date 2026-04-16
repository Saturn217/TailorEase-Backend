const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use("/api/v1/auth", authRoutes);


app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to TailorEase API'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;