import api from 'utils/api';

const forgotPassword = async (email) => {
  const req = api.post('/password/forgot', { email }).then(({ data }) => data.token);
  return await req;
};

const resetPassword = async (token, password, password_confirmation) => {
  const req = api
    .post('password/reset', { password, password_confirmation, token })
    .then(({ data }) => data.reset);
  return await req;
};

export { forgotPassword, resetPassword };
