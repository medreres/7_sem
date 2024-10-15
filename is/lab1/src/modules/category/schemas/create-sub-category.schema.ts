import * as yup from 'yup';

export const createSubCategorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  categoryId: yup.number().required('Category is required'),
  description: yup.string().required('Description is required'),
});
