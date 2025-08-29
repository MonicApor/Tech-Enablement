import * as yup from 'yup';

export const postSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  body: yup.string().required('Content is required'),
  category_id: yup.number().required('Category is required').notOneOf([0], 'Category is required'),
});

export const defaultValuesPost = {
  title: '',
  body: '',
  category_id: 0,
};
