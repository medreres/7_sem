import * as yup from 'yup';

export const createSubSubCategorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  subCategoryId: yup.number().required('Subcategory is required'),
  description: yup.string().required('Description is required'),
});
