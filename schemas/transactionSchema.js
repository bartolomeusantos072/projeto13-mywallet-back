import joi from "joi";

const transactionSchema = joi.object({
  type: joi.string().required(),
  description: joi.string().required(),
  value: joi.number().required()
});

export default transactionSchema;