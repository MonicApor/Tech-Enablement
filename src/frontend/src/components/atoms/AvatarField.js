import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import stringToColor from 'utils/stringToColor';

function AvatarField(props) {
  const { width = 140, url, label = 'No Label', onFileSelect, editable = false } = props;
  const avatarRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const selectAvatar = (e) => {
    let url = null;

    if (e.target.files.length > 0) {
      url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
      onFileSelect(e.target.files[0]);
    }
  };

  const changeAvatar = () => avatarRef.current.click();

  const getInitials = (words) => {
    let initials = '';
    if (!words) return '';
    words.map((word) => (initials += word.substr(0, 1)));
    return initials;
  };

  useEffect(() => setAvatarUrl(url), [url]);

  const getAvatarProps = () => {
    let props = {
      bgcolor: stringToColor(label),
      width,
      height: 140,
      display: 'flex',
      borderRadius: '50%',
      padding: 1,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 700,
      fontSize: 48,
      overflow: 'none',
    };

    return avatarUrl
      ? {
          ...props,
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'cover',
        }
      : props;
  };

  return (
    <Box sx={{ position: 'relative', width, mx: 'auto', mb: 4 }}>
      <Box sx={getAvatarProps()}>{!avatarUrl && getInitials(label?.split(' '))}</Box>

      {editable && (
        <Box
          sx={{
            background: '#fff',
            width: 32,
            height: 32,
            display: 'flex',
            borderRadius: '50%',
            padding: 1,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'absolute',
            mt: -3,
            right: 16,
            boxShadow: '1px 1px 16px 1px rgba(0,0,0,0.21)',
          }}
          onClick={changeAvatar}
        >
          <EditIcon />
        </Box>
      )}

      <input
        type="file"
        ref={avatarRef}
        onChangeCapture={selectAvatar}
        style={{ display: 'none' }}
        name="avatar"
        accept="image/png, image/gif, image/jpeg"
      />
    </Box>
  );
}

AvatarField.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
  width: PropTypes.number,
  onFileSelect: PropTypes.func,
  editable: PropTypes.bool,
};

export default AvatarField;
