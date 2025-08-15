import api from 'utils/api';

const searchNotifications = async (query = {}) => {
  const req = api
    .get(`/notifications?${new URLSearchParams(query).toString()}`)
    .then(({ data }) => data);
  const { meta, data, unread } = await req;
  return { meta, data, unread };
};

const markNotificationSeen = async (id) => {
  const req = api.put(`/notifications/${id}/seen`).then(({ data }) => data);
  return await req;
};

export { searchNotifications, markNotificationSeen };
