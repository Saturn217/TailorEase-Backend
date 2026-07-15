const companyService = require('../services/companyService');



const updateCompanyDetails = async (req, res, next) => {
    try {
        const {companyId} = req.user
        const result = await companyService.updateCompanyDetails(companyId, req.body, req.file);
        res.status(200).json(result);
        
    } catch (error) {
       next(error)
    }
}


module.exports = { updateCompanyDetails }