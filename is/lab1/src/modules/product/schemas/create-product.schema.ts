import * as yup from 'yup';

export const createProductSchema = yup.object().shape({
  productInternalId: yup.string().required('Internal product id required'),
  name: yup.string().required('Name is required'),
  categoryId: yup.number().required('Category is required'),
  code: yup.string().required('Code is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().nullable(),
});
