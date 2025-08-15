import api from 'utils/api';

const searchPermissions = async () => {
  const req = api.get('/permissions').then(({ data }) => data);
  const data = await req;
  return data;
};

export { searchPermissions };
