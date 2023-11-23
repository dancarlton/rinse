import Joi from 'joi';

export function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().valid('admin', 'user', 'provider').required(),
  });

  return schema.validate(user);
}

export function validateLoginInput(input) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    // validation for login password should be minimal so we don't tell malicious users password params
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(input);
}

export function validateRegisterInput(input) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(
        // one uppercase, one lowercase, one digit,
        // one special character( @ $ ! % * ? & ) 6-30 characters long
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/
      )
      .required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validateEmail(input) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validatePassword(input) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(
        // one uppercase, one lowercase, one digit,
        // one special character( ! @ # $ % ^ & * ) 6-30 characters long
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*^?&])[A-Za-z\d@$!%^*?&]{6,30}$/
      )
      .required(),
  });
  return schema.validate(input);
}
