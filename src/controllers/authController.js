
const authService = require("../services/authService");
const AppError = require('../utils/AppError');

const registerCompany = async (req, res) => {
    try {
        const result = await authService.registerCompany(req.body);
        res.status(201).send(result);
    }
    catch (error) {

        if (error.message === 'All fields are required' || error.message === 'Email already exists') {
            return res.status(400).json({ error: error.message });
        }
        res.status(400).json({ message: "server error", error: error.message });

    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {

        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
    }
};

module.exports = { registerCompany, login };