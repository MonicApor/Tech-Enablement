import PropTypes from 'prop-types';
import React from 'react';
import {
  Archive,
  Description,
  Download,
  Image,
  InsertDriveFile,
  PictureAsPdf,
  Visibility,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

export const getFileIcon = (attachment) => {
  if (attachment.is_image) return <Image color="primary" />;
  if (attachment.is_pdf) return <PictureAsPdf color="error" />;
  if (attachment.is_document) return <Description color="info" />;
  if (attachment.is_archive) return <Archive color="warning" />;
  return <InsertDriveFile color="action" />;
};

const PostAttachments = ({ attachments = [] }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const handleFileAction = (attachment) => {
    if (attachment.is_image) {
      window.open(attachment.url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.original_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getActionIcon = (attachment) => {
    if (attachment.is_image) return <Visibility />;
    return <Download />;
  };

  const getActionLabel = (attachment) => {
    if (attachment.is_image) return 'View';
    return 'Download';
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Attachments ({attachments.length})
      </Typography>
      <List dense>
        {attachments.map((attachment, index) => (
          <ListItem
            key={attachment.id || index}
            sx={{
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 1,
              mb: 1,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'grey.50',
                borderColor: 'primary.main',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{getFileIcon(attachment)}</ListItemIcon>
            <ListItemText
              primary={attachment.original_name}
              secondary={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Chip
                    label={attachment.human_file_size}
                    size="small"
                    variant="outlined"
                    component="span"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                  <Typography variant="caption" color="text.secondary" component="span">
                    {attachment.mime_type}
                  </Typography>
                </span>
              }
            />
            <IconButton
              edge="end"
              aria-label={getActionLabel(attachment)}
              onClick={() => handleFileAction(attachment)}
              color="primary"
              size="small"
              title={getActionLabel(attachment)}
            >
              {getActionIcon(attachment)}
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

PostAttachments.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      original_name: PropTypes.string.isRequired,
      file_size: PropTypes.number,
      human_file_size: PropTypes.string,
      mime_type: PropTypes.string,
      url: PropTypes.string.isRequired,
      is_image: PropTypes.bool,
      is_pdf: PropTypes.bool,
      is_document: PropTypes.bool,
      is_archive: PropTypes.bool,
    })
  ),
};

export default PostAttachments;
