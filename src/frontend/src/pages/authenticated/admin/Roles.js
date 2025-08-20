import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteRole, retrieveRole, searchRoles } from 'services/role.service';
import Box from '@mui/material/Box';
import DataTable from 'components/molecules/DataTable';
import AddEditModal from 'components/molecules/roles/AddEditModal';
import { criteria, meta as defaultMeta } from 'config/search';

function Roles() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [role, setRole] = useState(null);
  const [query, setQuery] = useState(criteria);
  const [meta, setMeta] = useState(defaultMeta);
  const [open, setOpen] = useState(false);

  const fetchRoles = async () => {
    const { meta, data } = await searchRoles(query);
    setMeta({ ...meta, meta });
    setData(data);
  };

  useEffect(() => {
    fetchRoles();
  }, [query]);

  const headers = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'ID',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('pages.roles.name'),
    },
  ];

  const handleChangePage = (event, value) => {
    setQuery({ ...query, ...{ page: value } });
  };

  const handleSort = (event, { order, sort }) => {
    setQuery({ ...query, ...{ order, sort } });
  };

  const handleSearch = (keyword) => {
    setQuery({ ...query, ...{ keyword, page: 1 } });
  };

  const handleEdit = async (id) => {
    const role = await retrieveRole(id);
    setOpen(true);
    setRole(role);
  };

  const handleDelete = async (id) => {
    if (confirm(t('pages.roles.delete_confirmation'))) {
      await deleteRole(id);
      fetchRoles();
      toast(t('pages.roles.role_deleted'), { type: 'success' });
    }
  };

  const handleAdd = async () => {
    setRole(null);
    setOpen(true);
  };

  const handleSaveEvent = (response) => {
    if (!role) {
      fetchRoles();
      setOpen(false);
      toast(t('pages.roles.role_created'), { type: 'success' });
      return;
    }

    let updatedList = [...data];
    const index = updatedList.findIndex((row) => parseInt(row.id) === parseInt(response.id));
    updatedList[index] = response;
    setData(updatedList);
    setOpen(false);
    toast(t('pages.roles.role_updated'), { type: 'success' });
  };

  return (
    <Box>
      <DataTable
        header={headers}
        data={data}
        page={query.page}
        total={meta.lastPage}
        order={query.order}
        sort={query.sort}
        handleChangePage={handleChangePage}
        handleSort={handleSort}
        handleSearch={handleSearch}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleAdd={handleAdd}
      />

      <AddEditModal
        open={open}
        role={role}
        handleSaveEvent={handleSaveEvent}
        handleClose={() => setOpen(false)}
      />
    </Box>
  );
}

export default Roles;
