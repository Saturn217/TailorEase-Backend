const companyService = require('../services/companyService');
const AppError = require('../utils/AppError');


const updateCompanyDetails = async (req, res) => {
    try {
        const {companyId} = req.user
        const result = await companyService.updateCompanyDetails(companyId, req.body, req.file);
        res.status(200).json(result);
        
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
        
    }
}


module.exports = { updateCompanyDetails }