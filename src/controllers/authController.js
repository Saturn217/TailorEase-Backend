
const authService = require("../services/authService");


const registerCompany = async (req, res, next) => {
    try {
        const result = await authService.registerCompany(req.body, req.file);
        res.status(201).send(result);
    }
    catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (error) {

       next(error)
    }
};

const registerStaff = async (req, res, next)=>{
    try{
        const result = await authService.registerStaff(req.body);
        res.status(201).json(result);
    }
    catch(error){
        next(error)
    }
}


module.exports = { registerCompany, login, registerStaff};