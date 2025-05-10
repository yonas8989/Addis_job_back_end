import Joi from 'joi';

export const yieldPredictionValidation = Joi.object({
  humidity: Joi.number().required().messages({
    'number.base': 'Humidity must be a number',
    'any.required': 'Humidity is required'
  }),
  temperatureMax: Joi.number().required().messages({
    'number.base': 'Max temperature must be a number',
    'any.required': 'Max temperature is required'
  }),
  temperatureMin: Joi.number().required().messages({
    'number.base': 'Min temperature must be a number',
    'any.required': 'Min temperature is required'
  }),
  windSpeed: Joi.number().required().messages({
    'number.base': 'Wind speed must be a number',
    'any.required': 'Wind speed is required'
  })
});

export const yieldHistoryValidation = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional().when('startDate', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('startDate'))
  })
});