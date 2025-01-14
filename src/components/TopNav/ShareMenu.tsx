import Button from 'components/Button';
import CopyIcon from 'components/Icons/CopyIcon';
import Mixpanel from 'util/mixpanel';
import useClipboard from 'react-use-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Container, Flex, Input, Text } from 'theme-ui';
import theme from '../../theme';
import ShareIcon from 'components/Icons/ShareIcon';
import InfoIcon from 'components/Icons/InfoIcon';
import { useProject } from 'providers/Project/projectHooks';
import { FaClipboardCheck } from 'react-icons/fa';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.borderColor}`,
    boxShadow: `0px 4px 40px rgba(0, 0, 0, 0.08)`,
    position: 'absolute',
    zIndex: '15',
    right: '170px',
    margin: '0',
    background: theme.colors.white,
    padding: '1rem',
  },
  copyLink: {
    flexDirection: 'row',
    paddingBottom: '12px',
  },
  menuButton: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
    '&:disabled': {
      color: '#DEE2E9',
      '&:hover': {
        background: '#F6F7F9',
        cursor: 'not-allowed',
      },
    },
  },
  ctaButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '113px',
    marginLeft: '4px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    height: '48px',
    whiteSpace: 'nowrap',
    fontSize: '0.75rem',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
  linkInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '363px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '4px',
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export const ShareMenu = () => {
  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { project } = useProject();

  const isSaved = !!project?.updatedAt;

  const copyLink = () => {
    setCopied();
    Mixpanel.track('Share link copied', { url });
  };

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Container sx={styles.container} ref={ref}>
      <Button
        sx={styles.menuButton}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        variant="secondary"
        size="sm"
        inline={true}
        disabled={!isSaved}
      >
        Share
        <ShareIcon />
      </Button>
      {isOpen && (
        <Flex sx={styles.menu}>
          <Flex sx={styles.copyLink}>
            <Input sx={styles.linkInput} defaultValue={url} />
            <Button
              onClick={copyLink}
              variant="secondary"
              size="md"
              sx={styles.ctaButton}
            >
              {!isCopied ? 'Copy URL' : 'Copied!'}
              {!isCopied ? <CopyIcon /> : <FaClipboardCheck />}
            </Button>
          </Flex>
          <Text sx={styles.message}>
            <InfoIcon /> Your current page will be where your share link lands.
          </Text>
        </Flex>
      )}
    </Container>
  );
};
