import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  updateFlagPostStatus,
  useFlagPostStatuses,
  useFlagPosts,
} from 'services/flag-post.service';
import { Chip, FormControl, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import DataTable from 'components/molecules/DataTable';

function FlagPost() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');

  const { flagPosts, meta, mutate } = useFlagPosts(page, search, sort);
  const { flagPostStatuses } = useFlagPostStatuses();

  const handleStatusChange = useCallback(
    async (flagPostId, newStatusId) => {
      try {
        await updateFlagPostStatus(flagPostId, newStatusId);
        toast.success('Status updated successfully');
      } catch (error) {
        toast.error('Failed to update status');
        console.error('Error updating status:', error);
      }
    },
    [mutate]
  );

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case 'Open':
        return 'info';
      case 'In Review':
        return 'warning';
      case 'Escalated':
        return 'error';
      case 'Resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const headers = [
    { id: 'row_number', numeric: false, disablePadding: false, label: 'No' },
    { id: 'post.title', numeric: false, disablePadding: false, label: 'Post Title' },
    { id: 'employee.username', numeric: false, disablePadding: false, label: 'Flagged By' },
    { id: 'reason', numeric: false, disablePadding: false, label: 'Reason' },
    { id: 'status_id', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'post.flaged_at', numeric: false, disablePadding: false, label: 'Flagged At' },
    { id: 'escalated_at', numeric: false, disablePadding: false, label: 'Escalated At' },
  ];

  const renderStatusCell = (row) => {
    return (
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={row.status_id}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          displayEmpty
          sx={{
            '& .MuiSelect-select': {
              padding: '4px 8px',
              fontSize: '0.875rem',
            },
          }}
        >
          {flagPostStatuses?.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              <Chip
                label={status.name}
                color={getStatusColor(status.name)}
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderRowNumberCell = (row) => {
    return <Typography variant="body2">{row.row_number}</Typography>;
  };

  const customRenderers = {
    status_id: renderStatusCell,
    row_number: renderRowNumberCell,
  };

  return (
    <Box>
      <DataTable
        header={headers}
        data={flagPosts}
        page={meta?.current_page || 1}
        total={Math.ceil((meta?.total || 0) / 10)}
        order={sort}
        sort={sort}
        handleChangePage={(event, value) => {
          setPage(value);
        }}
        handleSort={(event, { sort }) => {
          setSort(sort);
        }}
        handleSearch={(keyword) => {
          setSearch(keyword);
          setPage(1);
        }}
        actions={false}
        actionsAdd={false}
        customRenderers={customRenderers}
      />
    </Box>
  );
}

export default FlagPost;
