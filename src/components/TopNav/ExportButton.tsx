import Button from 'components/Button';
import Mixpanel from 'util/mixpanel';
import React, { useState } from 'react';
import theme from '../../theme';
import { SXStyles } from 'src/types';
import { Container } from 'theme-ui';
import { useProject } from 'providers/Project/projectHooks';
import { LOCAL_PROJECT_ID } from 'util/url';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ConfirmationPopup from 'components/ConfirmationPopup';
import * as GoogleAnalytics from 'util/google-analytics';

const DOWNLOAD_EVENT = 'export project downloaded';
const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  button: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
  buttonDisabled: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: '#F6F7F9',
    color: '#DEE2E9',
  },
};

export const ExportButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const projectId =
    window.location.pathname.slice(1) === LOCAL_PROJECT_ID
      ? null
      : window.location.pathname.slice(1);

  const { project } = useProject();

  const saveProjectClicked = async (isDownload: boolean) => {
    setIsOpen(false);
    if (!isDownload) return;

    const zip = new JSZip();
    const cadence = zip.folder('cadence');
    const contracts = cadence.folder('contracts');
    project.contractTemplates.map((cdc) =>
      contracts.file(`${cdc.title}.cdc`, cdc.script),
    );
    const scripts = cadence.folder('scripts');
    project.scriptTemplates.map((script) =>
      scripts.file(`${script.title}.cdc`, script.script),
    );
    const transactions = cadence.folder('transactions');
    project.transactionTemplates.map((tx) =>
      transactions.file(`${tx.title}.cdc`, tx.script),
    );
    const vscode = zip.folder('.vscode');
    vscode.file(
      `${project.id}.play`,
      JSON.stringify({ id: project.id, updatedAt: project.updatedAt }, null, 2),
    );
    zip.generateAsync({ type: 'blob' }).then(function (content: any) {
      Mixpanel.track(DOWNLOAD_EVENT, { projectId });
      GoogleAnalytics.event(DOWNLOAD_EVENT);
      saveAs(content, `${project.title}.zip`);
    });
  };

  const infoLastProjectOptions = {
    title: `Export Project: ${project.title}`,
    messages: [
      'Use vs code extension and flow-cli to deploy to an emulator or network.',
      'Use "flow init" to generate a flow.json file for this project.',
      'Download project files?',
    ],
  };

  return (
    <Container sx={styles.container}>
      <Button
        sx={styles.button}
        onClick={() => setIsOpen(true)}
        variant="secondary"
        size="sm"
        inline={true}
      >
        Export
      </Button>
      <ConfirmationPopup
        onClose={saveProjectClicked}
        visible={isOpen}
        {...infoLastProjectOptions}
      />
    </Container>
  );
};
