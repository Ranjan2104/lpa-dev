const Joi = require("joi");
const { errorHandler } = require("../utils/responseHandler");

const Validators = {
  validSendOTP: Joi.object({
    mobileNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Mobile number should be of 10 digits.",
        "any.required": "Mobile number is required.",
      }),
  }),
  validVerifyOTP: Joi.object({
    mobileNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Mobile number should be of 10 digits.",
        "any.required": "Mobile number is required.",
      }),
    otp: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base": "OTP should be of 6 digits.",
        "any.required": "OTP is required.",
      }),
    referalCode: Joi.string(),
  }),
  validLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  validAdminRegister: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobileNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Mobile number should be of 10 digits.",
        "any.required": "Mobile number is required.",
      }),
  }),
  validUploadKYCDocument: Joi.object({
    name: Joi.string().required(),
    frontPhoto: Joi.string().required(),
    backPhoto: Joi.string().required(),
    aadharNumber: Joi.string().required(),
  }),
  validLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  validUpdateProfile: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    mobileNo: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Mobile number should be of 10 digits.",
        "any.required": "Mobile number is required.",
      }),
    password: Joi.string(),
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
