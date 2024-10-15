import * as yup from 'yup';

export const createCategorySchema = yup.object().shape({
  internalCategoryId: yup
    .number()
    .typeError('Must be a number')
    .required('Internal category id required'),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});
