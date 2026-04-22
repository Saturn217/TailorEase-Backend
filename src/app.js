const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use("/api/v1/auth", authRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use("/api/v1/admin", adminRoutes);

const staffRoutes = require('./routes/staff.routes');
app.use("/api/v1/staff", staffRoutes);

const customerRoutes = require('./routes/customer.routes');
app.use("/api/v1/customers", customerRoutes);


app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to TailorEase API'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;