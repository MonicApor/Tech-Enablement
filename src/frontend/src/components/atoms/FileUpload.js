import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Archive,
  CloudUpload,
  Delete,
  Description,
  Image,
  InsertDriveFile,
  PictureAsPdf,
} from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const FileUpload = ({
  onFileChange,
  multiple = true,
  accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.zip,.rar',
  initialFiles = [],
  value = null,
  clearFiles = false,
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setFiles(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (clearFiles) {
      setFiles([]);
      if (onFileChange && typeof onFileChange === 'function') {
        onFileChange([]);
      }
    }
  }, [clearFiles, onFileChange]);

  const handleFileSelect = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles);
    const maxFileSize = 5 * 1024 * 1024;

    if (selectedFiles.size > maxFileSize) {
      setError(`File too large (max 5MB): ${selectedFiles.name}`);
      setTimeout(() => setError(''), 5000);
      return;
    }

    // validate file count
    if (multiple && files.length + newFiles.length > 5) {
      setError('Maximum 5 files allowed. You can zip your files to reduce the size.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setError('');

    if (multiple) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      if (onFileChange && typeof onFileChange === 'function') {
        onFileChange(updatedFiles);
      }
    } else {
      setFiles(newFiles);
      if (onFileChange && typeof onFileChange === 'function') {
        onFileChange(newFiles);
      }
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      handleFileSelect(selectedFiles);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target || event.currentTarget.contains(event.target)) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const removeFile = (index) => {
    if (index < 0 || index >= files.length) return;

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFileChange && typeof onFileChange === 'function') {
      onFileChange(newFiles);
    }
  };

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image color="primary" />;
    if (type === 'application/pdf') return <PictureAsPdf color="error" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive color="warning" />;
    if (type.includes('document') || type.includes('word')) return <Description color="info" />;
    return <InsertDriveFile color="action" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <input
        ref={fileInputRef}
        accept={accept}
        style={{ display: 'none' }}
        type="file"
        multiple={multiple}
        onChange={handleFileInputChange}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Paper
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileInput}
        draggable={false}
        sx={{
          border: '2px dashed',
          borderColor: isDragOver ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragOver ? 'primary.50' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isDragOver ? 4 : 1,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDragOver ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            transition: 'background-color 0.2s ease-in-out',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            {isDragOver ? t('PostANON.dropFilesHere') : t('PostANON.dragAndDropFilesHere')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('PostANON.orClickToBrowseFiles')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('PostANON.supportedFormats')} {accept} • {t('PostANON.maxFileSize')} 5MB
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('PostANON.attachedFiles')} ({files.length})
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>{getFileIcon(file)}</Box>
                <ListItemText
                  primary={file.name}
                  secondary={`${formatFileSize(file.size)} • ${file.type || 'Unknown type'}`}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeFile(index)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

FileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  initialFiles: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  clearFiles: PropTypes.bool,
};

export default FileUpload;
