import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Image from 'next/image'

export const Logo = styled((props) => {
  const { variant, ...other } = props;


  return (
    <Image src="/img/logo.svg" alt="Hero" width="42" height="42" {...other} />
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
