const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError');



const updateCompanyDetails = async (companyId, data, file) => {
    const companyImage = file ? file.path : null

    const { companyName, ownerPhone, ownerFullname } = data || {}

    if (!companyName && !ownerPhone && !ownerFullname && !file) {
        throw new AppError("Nothing to Update", 400)

    }

    const company = await prisma.company.findFirst({
        where: {
            id: companyId
        },
        select: {
            id: true,
            companyName: true,
            ownerPhone: true,
            ownerFullname: true,
            companyImage: true,
            createdAt: true,
            updatedAt: true
        }

    })

    if (!company) {
        throw new AppError("Company not found", 404)
    }


    const updatedCompany = await prisma.company.update({
        where: {
            id: companyId
        },

        data: {
            ...(companyName ? { companyName } : {}),
            ...(ownerPhone ? { ownerPhone } : {}),
            ...(ownerFullname ? { ownerFullname } : {}),
            ...(companyImage ? { companyImage } : {})
        },
        select: {
            id: true,
            companyName: true,
            ownerPhone: true,
            ownerFullname: true,
            companyImage: true,
            createdAt: true,
            updatedAt: true
        }
    })

    const actions = []
    if (companyName) actions.push("renamed")
    if (ownerPhone) actions.push("owner phone updated")
    if (ownerFullname) actions.push("owner fullname updated")
    if (companyImage) actions.push("image updated")

    return {
        message: `Company ${actions.join(", ")} successfully`,
        previousCompanyDetails: {
            id: company.id,
            companyName: company.companyName,
            ownerPhone: company.ownerPhone,
            ownerFullname: company.ownerFullname,
            companyImage: company.companyImage,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        },

        updatedCompanyDetails: {
            companyName: updatedCompany.companyName,
            ownerPhone: updatedCompany.ownerPhone,
            ownerFullname: updatedCompany.ownerFullname,
            companyImage: updatedCompany.companyImage,
            createdAt: updatedCompany.createdAt,
            updatedAt: updatedCompany.updatedAt

        }
    }



}


module.exports = {updateCompanyDetails };