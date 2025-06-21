const Joi = require('joi');

const commaSeparatedToArray = (value, helpers) => {
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim());
  }
  return value;
};

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    mainCategory: Joi.string().valid('Men', 'Women', 'Kids').required(),
    apparelType: Joi.string().required(),

    subcategories: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().custom(commaSeparatedToArray)
    ),

    sizesAvailable: Joi.alternatives().try(
      Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL')),
      Joi.string().custom(commaSeparatedToArray)
    ),

    colors: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().custom(commaSeparatedToArray)
    ),

    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    description: Joi.string().allow(''),
    photos: Joi.alternatives().try(
      Joi.array().items(Joi.string()),  // e.g., URLs or paths
      Joi.string().custom(commaSeparatedToArray)
    ),

    productCode: Joi.string().alphanum().optional()  // Auto-generated, but optional
  }).required()
});


 

