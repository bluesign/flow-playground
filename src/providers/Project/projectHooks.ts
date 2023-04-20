import { useQuery } from '@apollo/react-hooks';
import { useContext } from 'react';

import { GET_LOCAL_PROJECT, GET_PROJECT } from 'api/apollo/queries';

import { Project } from 'api/apollo/generated/graphql';
import { ProjectContext, ProjectContextValue } from './index';
import { createDefaultProject, createLocalProject } from './projectDefault';
import { PROJECT_SERIALIZATION_KEY } from './projectMutator';
import { LOCAL_PROJECT_ID } from 'util/url';

function formatProject(project: Project) {
  if (!project) return project;
  // sort based on index, issue getting this to work in the backend
  project.contractTemplates.sort((a, b) => a.index - b.index);
  project.scriptTemplates.sort((a, b) => a.index - b.index);
  project.transactionTemplates.sort((a, b) => a.index - b.index);
  return project;
}

function writeDefaultProject(client: any) {
  const defaultProject = createDefaultProject();

  client.writeData({
    data: {
      activeProject: true,
      localProject: defaultProject,
    },
  });
}

function cloneProject(client: any, project: Project) {
  const localProject = createLocalProject(
    project.id,
    project.seed,
    project.title,
    project.description,
    project.readme,
    project.accounts.map((acc) => acc.address),

    project.contractTemplates.map((tpl) => ({
      code: tpl.script,
      title: tpl.title,
    })),

    project.transactionTemplates.map((tpl) => ({
      code: tpl.script,
      title: tpl.title,
    })),

    project.scriptTemplates.map((tpl) => ({
      code: tpl.script,
      title: tpl.title,
    })),
  );
  client.writeData({
    data: {
      activeProject: true,
      localProject: localProject,
    },
  });
}

export default function useGetProject(
  client: any,
  projectId: string | null,
  isActiveProject: boolean,
): {
  project: any | null;
  isLocal: boolean;
  isClone: boolean;
  isLoading: boolean;
} {
  const isNewProject = projectId == null || projectId === LOCAL_PROJECT_ID;

  const { loading, data: remoteData } = useQuery(GET_PROJECT, {
    variables: { projectId: projectId },
    // skip remote query if this is a new project
    skip: isNewProject,
    context: {
      serializationKey: PROJECT_SERIALIZATION_KEY,
    },
  });

  if (isNewProject) {
    if (!isActiveProject) {
      writeDefaultProject(client);
    }

    return {
      project: readLocalProject(client),
      isLocal: true,
      isClone: false,
      isLoading: false,
    };
  }

  if (loading) {
    if (isActiveProject) {
      return {
        project: readLocalProject(client),
        isLocal: false,
        isClone: false,
        isLoading: false,
      };
    }

    return { project: null, isLocal: false, isClone: false, isLoading: true };
  }

  const remoteProject = formatProject(remoteData?.project);
  const isMutable = remoteProject.mutable;

  if (!isMutable) {
    if (!isActiveProject) {
      cloneProject(client, remoteProject);
    }

    return {
      project: readLocalProject(client),
      isLocal: true,
      isClone: true,
      isLoading: false,
    };
  }

  return {
    project: remoteProject,
    isLocal: false,
    isClone: false,
    isLoading: false,
  };
}

export function useProject(): ProjectContextValue {
  return useContext(ProjectContext);
}

function readLocalProject(client: any): any {
  const { project } = client.readQuery({ query: GET_LOCAL_PROJECT });
  return project;
}
