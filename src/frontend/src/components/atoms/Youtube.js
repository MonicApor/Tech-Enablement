import clsx from 'clsx';
import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Dialog } from '@mui/material';
import { Box, styled } from '@mui/system';

const BackdropUnstyled = forwardRef(function BackdropUnstyled(props, ref) {
  const { open, className, ...other } = props;
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />;
});

BackdropUnstyled.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const Modal = styled(Dialog)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.75);
`;

const Backdrop = styled(BackdropUnstyled)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  -webkit-tap-highlight-color: transparent;
`;

function Youtube(props) {
  const { videoId } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const thumbnailStyles = {
    background: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
    width: '100%',
    minHeight: '315px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const playIconWrapperStyles = (theme) => ({
    padding: '2px 16px',
    background: theme.palette.grey[800],
    borderRadius: theme.spacing(1.5),
    '&:hover': {
      background: theme.palette.error.dark,
    },
    cursor: 'pointer',
  });

  const modalContentStyles = () => ({
    width: '100%',
    maxWidth: '1024px',
    pb: '56.25%',
    bgcolor: 'none',
    position: 'relative',
  });

  return (
    <Box>
      <Box style={thumbnailStyles}>
        <Box sx={playIconWrapperStyles}>
          <PlayArrowIcon
            onClick={handleOpen}
            sx={(theme) => ({
              color: theme.palette.common.white,
              fontSize: 42,
            })}
          />
        </Box>
      </Box>

      <Modal
        aria-labelledby="youtube-modal"
        aria-describedby="youtube-modal-container"
        open={open}
        onClose={handleClose}
        components={{ Backdrop }}
      >
        <Box sx={{ width: '100%', maxWidth: '1024px', px: 2 }}>
          <CloseIcon
            onClick={handleClose}
            sx={{
              color: 'white',
              display: 'flex',
              alignItems: 'end',
              mb: 1,
              ml: 'auto',
              cursor: 'pointer',
              fontSize: 32,
            }}
          />

          <Box sx={modalContentStyles}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?controls=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

Youtube.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default Youtube;
