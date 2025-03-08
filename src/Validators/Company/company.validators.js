import Joi from 'joi';

export const AddCompany = {
    body: Joi.object({
        companyName: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().max(500).allow(""),
        industry: Joi.string().trim().max(100).allow(""),
        address: Joi.string().trim().max(255).allow(""),
        numberOfEmployees: Joi.string()
            .pattern(/^[0-9]+-[0-9]+$/)
            .custom((value, helpers) => {
                const range = value.split("-").map(Number);
                if (range.length !== 2 || range[0] >= range[1]) {
                    return helpers.message("numberOfEmployees must be a valid range like '11-20'");
                }
                return value;
            })
            .required(),
        companyEmail: Joi.string().email().required(),
        HRs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    })
}

export const UpdateCompany = {
    body: Joi.object({
      companyName: Joi.string().trim().min(5).max(20),
      companyEmail: Joi.string().email(),
      description: Joi.string().trim().max(500).allow(""),
      industry: Joi.string().trim().allow(""),
      address: Joi.string().trim().max(255).allow(""),
      numberOfEmployees: Joi.string()
        .regex(/^[0-9]+-[0-9]+$/)
        .custom((value, helpers) => {
          const range = value.split("-").map(Number);
          if (range.length !== 2 || range[0] >= range[1]) {
            return helpers.message("numberOfEmployees must be a valid range like '11-20'");
          }
          return value;
        }),
      Hrs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
    }),
  };
  export const SoftDeleteCompany = {
    params: Joi.object({
        companyName: Joi.string().required()
    })
}


export const SearchCompany = {
    params: Joi.object({
        companyName: Joi.string().required()
    })
}

export const UploadCompanyLogo = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}

export const UploadCompanyCover = {
    params: Joi.object({
        companyId: Joi.string().hex().length(24).required()
    })
}