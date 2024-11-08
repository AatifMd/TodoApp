const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authenticate = require('./middlewares/authenticate');
const registerRoutes = require('./routes/register')
const loginRoutes = require("./routes/login")
const forgotpassordRoute = require("./routes/forgotpassword")
const verifyOTPRoutes = require("./routes/verifyotp")
const resetPasswordRoute = require("./routes/resetpassword")
const todoRoute = require('./routes/todo')
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.error("Error connecting MongoDB", error)
})

app.use("/api/register", registerRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/verifyotp", verifyOTPRoutes)
app.use("/api/forgotpassword", forgotpassordRoute)
app.use("/api/resetpassword", resetPasswordRoute)
app.use("/api/todo", todoRoute)

app.get('/api/home', authenticate, (req, res) => {
    res.status(200).json({ message: 'Welcome to the home page!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

