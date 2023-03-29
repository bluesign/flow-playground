import { getAccountContract } from 'components/Editor/CadenceEditor/ControlPanel/utils';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { MonacoServices } from 'monaco-languageclient/lib/monaco-services';
import { useProject } from 'providers/Project/projectHooks';
import { useEffect, useState } from 'react';
import { createCadenceLanguageClient } from 'util/language-client';
import { CadenceLanguageServer, Callbacks } from 'util/language-server';

let monacoServicesInstalled = false;

async function startLanguageServer(callbacks: any, getCode: any, ops: any) {
  const { setLanguageServer, setCallbacks } = ops;
  const server = await CadenceLanguageServer.create(callbacks);
  new Promise(() => {
    let checkInterval = setInterval(() => {
      // .toServer() method is populated by language server
      // if it was not properly started or in progress it will be "null"
      if (callbacks.toServer !== null) {
        clearInterval(checkInterval);
        callbacks.getAddressCode = getCode;
        setCallbacks(callbacks);
        setLanguageServer(server);
        console.log('%c LS: Is Up!', 'color: #00FF00');
      }
    }, 100);
  });
}

const launchLanguageClient = async (
  callbacks: Callbacks,
  languageServer: CadenceLanguageServer,
  setLanguageClient: (languageClient: MonacoLanguageClient) => void,
) => {
  if (languageServer) {
    const newClient = createCadenceLanguageClient(callbacks);
    newClient.start();
    await newClient.onReady();
    setLanguageClient(newClient);
  }
};

export default function useLanguageServer() {
  const project = useProject();

  // Language Server Callbacks
  let initialCallbacks: Callbacks = {
    // The actual callback will be set as soon as the language server is initialized
    toServer: null,

    // The actual callback will be set as soon as the language server is initialized
    onClientClose: null,

    // The actual callback will be set as soon as the language client is initialized
    onServerClose: null,

    // The actual callback will be set as soon as the language client is initialized
    toClient: null,

    getAddressCode(_address: string): string | undefined {
      // we will set it once it is instantiated
      return undefined;
    },
  };

  // Base state handler
  const [languageServer, setLanguageServer] =
    useState<CadenceLanguageServer | null>(null);
  const [languageClient, setLanguageClient] =
    useState<MonacoLanguageClient | null>(null);
  const [callbacks, setCallbacks] = useState(initialCallbacks);

  const getCode = (_address: string): string => {
    const {
      project: { contractDeployments },
    } = project;

    // TODO: investigate if addresses is only contract addresses or other things
    //    if (active.type === EntityType.ContractTemplate) {
    return getAccountContract(_address, contractDeployments) || '';
  };

  const restartServer = () => {
    console.log('Restarting server...');

    startLanguageServer(callbacks, getCode, {
      setLanguageServer,
      setCallbacks,
    });
  };

  useEffect(() => {
    if (languageServer) {
      languageServer.updateCodeGetter(getCode);
    }
  }, [project.project.accounts]);

  useEffect(() => {
    // The Monaco Language Client services have to be installed globally, once.
    // An editor must be passed, which is only used for commands.
    // As the Cadence language server is not providing any commands this is OK

    console.log('Installing monaco services');
    if (!monacoServicesInstalled) {
      MonacoServices.install(monaco);
      monacoServicesInstalled = true;
    }

    restartServer();
  }, []);

  useEffect(() => {
    if (!languageClient) {
      launchLanguageClient(callbacks, languageServer, setLanguageClient).then();
    }
  }, [languageServer]);

  return {
    languageClient,
    languageServer,
    restartServer,
  };
}
