import api from 'utils/api';

const createProfile = async (data) => {
  const req = api.post('/register', data).then(({ data }) => data.data);
  return await req;
};

const updateProfile = async (data) => {
  let formData = new FormData();
  formData.append('_method', 'PUT');

  // set fields
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  const req = api
    .post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(({ data }) => data.data);

  return await req;
};

export { createProfile, updateProfile };
