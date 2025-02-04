const Joi = require("joi");
const { errorHandler } = require("../utils/responseHandler");
const { penalty } = require("../controllers/settingsController");

const Validators = {
  validSocialMediaLinks: Joi.object({
    whatsAppLink: Joi.string(),
    facebookLink: Joi.string(),
    instagramLink: Joi.string(),
    telegramLink: Joi.string(),
  }),
  validUpdateReferralAmountPercentage: Joi.object({
    referralAmountPercentage: Joi.number().required(),
  }),
  validUpdatePaymentSettings: Joi.object({
    upiQrCode: Joi.string().required(),
    upiId: Joi.string().required(),
  }),
  validUploadKYCDocument: Joi.object({
    name: Joi.string().required(),
    frontPhoto: Joi.string().required(),
    backPhoto: Joi.string().required(),
    aadharNumber: Joi.string().required(),
    mobileNo: Joi.string().required(),
  }),
  validBlockUser: Joi.object({
    userId: Joi.string().required(),
    block: Joi.boolean().required(),
  }),
  validAddBonus: Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
    reason: Joi.string(),
  }),
  validupdateBattleEarningPercentage: Joi.object({
    percentage: Joi.number().required(),
  }),
};

module.exports = Validators;

function Validator(func) {
  return async function Validator(req, res, next) {
    try {
      const validated = await Validators[func].validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validated;
      next();
    } catch (err) {
      let _er = {};
      if (err.isJoi) {
        err.details.forEach((d) => {
          let _key = d.context.key;
          _er[_key] = d.message;
        });
      }
      await next(
        errorHandler({
          res,
          statusCode: 400,
          message: _er,
        })
      );
    }
  };
}

module.exports = Validator;
