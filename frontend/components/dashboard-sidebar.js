import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Cog as CogIcon } from '../icons/cog';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { Exit as ExitIcon } from 'icons/exit';
import { Bulb as AlertIcon } from 'icons/bulb';
import { GridSquare } from 'icons/grid-square';
import { userService } from "services";
import { Logo } from './logo';
import { NavItem } from './nav-item';

const items = [
  {
    href: '/',
    icon: (<GridSquare fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/alerts',
    icon: (<AlertIcon fontSize="small" />),
    title: 'Alerts'
  },
  {
    href: '/centers',
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'Crisis centers'
  },
  {
    href: '/calls',
    icon: (<UserIcon fontSize="small" />),
    title: '911 calls'
  },
  {
    href: '/settings',
    icon: (<CogIcon fontSize="small" />),
    title: 'Settings'
  },
  {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    title: 'Hero Management'
  },
];

function logout(e) {
  e.preventDefault();
  userService.logout();
}

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );
  

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 1, pr: 0, background: '#ffff', color: '#000', border: 'none' }}>
        <Box display='flex' sx={{ borderRightStyle: 'solid', borderColor: '#E3E7ED'}} alignItems={'center'} justifyContent="space-around" >
          <NextLink
            href="/"
            passHref
          >
            <a>
              <Logo
                sx={{
                  height: 42,
                  width: 42
                }}
              />
            </a>
          </NextLink>
          <Typography variant='h6'>Hero Web Portal</Typography>
        </Box>
        </Box>

        <Box sx={{ flexGrow: 1, my: 3 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <NavItem
              icon={(<ExitIcon />)}
              href="#"
              title="Logout"
              onClick={logout}
            />
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280,
            border: 'none'
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
          border: 'none'
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
