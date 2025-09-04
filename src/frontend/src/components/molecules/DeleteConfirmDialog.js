import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Warning as WarningIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();
  const defaultTitle = t('PostANON.defaultDeleteTitle');
  const defaultMessage = t('PostANON.defaultDeleteMessage');
  const defaultConfirmText = t('PostANON.defaultDeleteConfirmText');
  const defaultCancelText = t('PostANON.defaultDeleteCancelText');

  const finalTitle = title || defaultTitle;
  const finalMessage = message || defaultMessage;
  const finalConfirmText = confirmText || defaultConfirmText;
  const finalCancelText = cancelText || defaultCancelText;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
          color: 'error.main',
        }}
      >
        <WarningIcon color="error" />
        <Typography variant="h6" component="span" fontWeight={600}>
          {finalTitle}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText
          id="delete-dialog-description"
          sx={{
            color: 'text.secondary',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
          dangerouslySetInnerHTML={{ __html: finalMessage }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            minWidth: 80,
            '&:hover': {
              borderColor: 'text.secondary',
            },
          }}
        >
          {finalCancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{
            minWidth: 80,
            bgcolor: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark',
            },
            '&:disabled': {
              bgcolor: 'error.light',
            },
          }}
        >
          {loading ? t('loadingDeleting') : finalConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  itemName: PropTypes.string,
  loading: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default DeleteConfirmDialog;
