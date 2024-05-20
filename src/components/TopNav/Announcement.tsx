import TimesIcon from 'components/Icons/TimesIcon';
import { AnnouncementContext } from 'providers/Announcement';
import React, { useContext } from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex, IconButton, Link, useThemeUI } from 'theme-ui';

const Announcement = () => {
  const context = useThemeUI();
  const { theme } = context;

  const { toggleAnnouncement } = useContext(AnnouncementContext);

  const styles: SXStyles = {
    root: {
      width: '100%',
      backgroundColor: 'white',
      flex: '1 1 auto',
      flexDirection: 'row',
      background: '#007BFF',
      padding: '0.25rem 0 0.5rem',
      height: '60px',
      color: `${theme.colors.secondary}`,
      justifyContent: 'space-around',
      alignContent: 'center',
    },
    content: {
      flex: '1 1 auto',
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',
    },
    message: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: `${theme.colors.secondary}`,
      fontSize: '14px',
      padding: '0.15rem',
      gap: '4px',
    },
    devLink: {
      textDecoration: 'underline',
      color: `${theme.colors.secondary}`,
    },
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.content}>
        <Box sx={styles.message}>🔧 Upgrade to Cadence 1.0 🔧</Box>
        <Box sx={styles.message}>
          <Link
            sx={styles.devLink}
            target="_blank"
            rel="noreferrer"
            href="https://flow.com/upgrade/crescendo/migration"
          >
            Upgrade
          </Link>
          your Cadence contracts on Testnet before June 19th! All contracts must be updated to avoid breaking.
        </Box>
      </Flex>
      <IconButton size="lg" onClick={toggleAnnouncement}>
        <TimesIcon primary />
      </IconButton>
    </Flex>
  );
};

export default Announcement;
