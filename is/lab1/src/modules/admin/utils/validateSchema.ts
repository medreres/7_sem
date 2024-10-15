import { ValidationError } from 'adminjs';
import * as yup from 'yup';

export const validateWithSchema = async <T, P>(
  schema: yup.Schema<T>,
  payload: P,
): Promise<void> => {
  try {
    await schema.validate(payload, {
      abortEarly: false,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = {};

      error.inner.forEach((err) => {
        validationErrors[err.path!] = {
          message: err.message,
        };
      });

      throw new ValidationError(validationErrors);
    }

    throw error;
  }
};
