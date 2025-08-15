import api from 'utils/api';

const searchRoles = async (query) => {
  const req = api.get(`/roles?${new URLSearchParams(query).toString()}`).then(({ data }) => data);
  const { meta, data } = await req;
  return { meta, data };
};

const createRole = async (data) => {
  const req = api.post('/roles', data).then(({ data }) => data.data);
  return await req;
};

const retrieveRole = async (id) => {
  const req = api.get(`/roles/${id}`).then(({ data }) => data.data);
  return await req;
};

const updateRole = async (id, data) => {
  const req = api.put(`/roles/${id}`, data).then(({ data }) => data.data);
  return await req;
};

const deleteRole = async (id) => {
  const req = api.delete(`/roles/${id}`).then(({ data }) => data);
  const { deleted } = await req;
  return deleted;
};

export { searchRoles, createRole, retrieveRole, updateRole, deleteRole };
