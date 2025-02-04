const Joi = require("joi");
const { errorHandler } = require("../utils/responseHandler");

const bankAccountDetailsSchema = Joi.object({
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  ifscCode: Joi.string().required(),
});

const userDetailsSchema = Joi.object({
  name: Joi.string().required(),
  mobileNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number should be of 10 digits.",
      "any.required": "Mobile number is required.",
    }),
});

const Validators = {
  validTransactionEntry: Joi.object({
    userDetails: Joi.when("type", {
      is: "withdraw",
      then: userDetailsSchema.required().messages({
        "any.required": "User details are required when type is 'withdraw'.",
      }),
      otherwise: Joi.optional(),
    }),
    type: Joi.string().valid("deposit", "withdraw", "referral").required(),
    utrNo: Joi.when("type", {
      is: "deposit",
      then: Joi.string()
        .required()
        .pattern(/^\d{12}$/)
        .messages({
          "string.pattern.base": "UTR No must be a 12-digit number.",
          "any.required": "UTR No is required when type is 'deposit'.",
        }),   
      otherwise: Joi.optional(),
    }),
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.when("type", {
      is: "withdraw",
      then: Joi.string().valid("upi", "bankAccount").required().messages({
        "any.required": "Payment method is required when type is 'withdraw'.",
      }),
      otherwise: Joi.optional(),
    }),
    upiId: Joi.when("paymentMethod", {
      is: "upi",
      then: Joi.string().required().messages({
        "any.required": "UPI ID is required when paymentMethod is 'upi'.",
      }),
      otherwise: Joi.forbidden(),
    }),
    bankAccountDetails: Joi.when("paymentMethod", {
      is: "bankAccount",
      then: bankAccountDetailsSchema.required().messages({
        "any.required":
          "Bank Account Details are required when paymentMethod is 'bankAccount'.",
      }),
      otherwise: Joi.forbidden(),
    }),
    screenShot: Joi.string().optional(),
  }),

  validTransactionResponseByAdmin: Joi.object({
    transactionId: Joi.string().required(),
    isApproved: Joi.boolean().required(),
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
