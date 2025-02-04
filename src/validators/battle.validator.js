const Joi = require("joi");
const { errorHandler } = require("../utils/responseHandler");

const Validators = {
  validCreateBattle: Joi.object({
    amount: Joi.string().required(),
  }),
  validAcceptOrRejectRequestByCreater: Joi.object({
    battleId: Joi.string().required(),
    status: Joi.string().valid("accept", "reject").required(),
  }),
  validEnterRoomNumber: Joi.object({
    battleId: Joi.string().required(),
    roomNumber: Joi.string().required(),
  }),
  ValidUpdateBattleResultByUser: Joi.object({
    battleId: Joi.string().required(),
    matchStatus: Joi.string().valid("WON", "LOSS", "CANCELLED").required(),
    cancellationReason: Joi.string(),
    screenShot: Joi.string(),
  }),
  ValidUpdateBattleResultByAdmin: Joi.object({
    battleId: Joi.string().required(),
    winner: Joi.string().allow(null).required(),
    looser: Joi.string().allow(null).required(),
    isCancelled: Joi.boolean().required(),
  }),
  validBlockUser: Joi.object({
    userId: Joi.string().required(),
    block: Joi.boolean().required(),
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
