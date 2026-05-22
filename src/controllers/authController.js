
const authService = require("../services/authService");
const AppError = require('../utils/AppError');

const registerCompany = async (req, res) => {
    try {
        const result = await authService.registerCompany(req.body, req.file);
        res.status(201).send(result);
    }
    catch (error) {
        const statusCode = error.statusCode || 500

        res.status(statusCode).json({ message:error.message });

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

const registerStaff = async (req, res)=>{
    try{
        const result = await authService.registerStaff(req.body);
        res.status(201).json(result);
    }
    catch(error){
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
    }
}


module.exports = { registerCompany, login, registerStaff};