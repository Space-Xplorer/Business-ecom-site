const Joi = require('joi');

module.exports. productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  sizesAvailable: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),
  colors: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),
  description: Joi.string().allow(''),
  photos: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),
  productCode: Joi.string().optional()
});
 

