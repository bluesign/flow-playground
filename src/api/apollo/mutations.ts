import gql from 'graphql-tag';

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $parentId: UUID
    $title: String!
    $description: String!
    $readme: String!
    $seed: Int!
    $numberOfAccounts: Int!
    $transactionTemplates: [NewProjectTransactionTemplate!]!
    $scriptTemplates: [NewProjectScriptTemplate!]!
    $contractTemplates: [NewProjectContractTemplate!]!
  ) {
    project: createProject(
      input: {
        parentId: $parentId
        numberOfAccounts: $numberOfAccounts
        seed: $seed
        title: $title
        description: $description
        readme: $readme
        transactionTemplates: $transactionTemplates
        scriptTemplates: $scriptTemplates
        contractTemplates: $contractTemplates
      }
    ) {
      id
      persist
      mutable
      parentId
      seed
      title
      description
      readme
      accounts {
        address
        deployedContracts
        state
      }
      transactionTemplates {
        id
        script
        title
      }
      scriptTemplates {
        id
        script
        title
      }
      contractTemplates {
        id
        script
        title
      }
    }
  }
`;

export const SAVE_PROJECT = gql`
  mutation UpdateProject(
    $projectId: UUID!
    $title: String!
    $description: String!
    $readme: String!
  ) {
    updateProject(
      input: {
        id: $projectId
        persist: true
        title: $title
        description: $description
        readme: $readme
      }
    ) {
      id
      persist
      title
      description
      readme
    }
  }
`;

export const SET_ACTIVE_PROJECT = gql`
  mutation SetActiveProject($id: Int!) {
    setActiveProjectId(id: $id) @client
  }
`;

export const CREATE_CONTRACT_TEMPLATE = gql`
  mutation CreateContractTemplate(
    $projectId: UUID!
    $script: String!
    $title: String!
  ) {
    createContractTemplate(
      input: { projectId: $projectId, script: $script, title: $title }
    ) {
      id
      script
      title
    }
  }
`;

export const UPDATE_CONTRACT_TEMPLATE = gql`
  mutation UpdateContractTemplate(
    $projectId: UUID!
    $templateId: UUID!
    $script: String!
    $title: String
  ) {
    updateContractTemplate(
      input: {
        projectId: $projectId
        id: $templateId
        script: $script
        title: $title
      }
    ) {
      id
      script
      index
      title
    }
  }
`;

export const DELETE_CONTRACT_TEMPLATE = gql`
  mutation DeleteContractTemplate($projectId: UUID!, $templateId: UUID!) {
    deleteContractTemplate(id: $templateId, projectId: $projectId)
  }
`;

export const CREATE_CONTRACT_DEPLOYMENT = gql`
  mutation CreateContractDeployment(
    $projectId: UUID!
    $script: String!
    $signer: Address!
    $arguments: [String!]
  ) {
    createContractDeployment(
      input: {
        projectId: $projectId
        script: $script
        address: $signer
        arguments: $arguments
      }
    ) {
      id
      script
      errors {
        message
        startPosition {
          offset
          line
          column
        }
        endPosition {
          offset
          line
          column
        }
      }
      logs
      events {
        type
        values
      }
    }
  }
`;

export const UPDATE_TRANSACTION_TEMPLATE = gql`
  mutation UpdateTransactionTemplate(
    $projectId: UUID!
    $templateId: UUID!
    $script: String!
    $title: String
  ) {
    updateTransactionTemplate(
      input: {
        projectId: $projectId
        id: $templateId
        script: $script
        title: $title
      }
    ) {
      id
      script
      index
      title
    }
  }
`;

export const CREATE_TRANSACTION_TEMPLATE = gql`
  mutation CreateTransactionTemplate(
    $projectId: UUID!
    $script: String!
    $title: String!
  ) {
    createTransactionTemplate(
      input: { projectId: $projectId, script: $script, title: $title }
    ) {
      id
      script
      title
    }
  }
`;

export const DELETE_TRANSACTION_TEMPLATE = gql`
  mutation DeleteTransactionTemplate($projectId: UUID!, $templateId: UUID!) {
    deleteTransactionTemplate(id: $templateId, projectId: $projectId)
  }
`;

export const CREATE_TRANSACTION_EXECUTION = gql`
  mutation CreateTransactionExecution(
    $projectId: UUID!
    $script: String!
    $signers: [Address!]
    $arguments: [String!]
  ) {
    createTransactionExecution(
      input: {
        projectId: $projectId
        script: $script
        signers: $signers
        arguments: $arguments
      }
    ) {
      id
      script
      errors {
        message
        startPosition {
          offset
          line
          column
        }
        endPosition {
          offset
          line
          column
        }
      }
      logs
      events {
        type
        values
      }
    }
  }
`;

export const UPDATE_SCRIPT_TEMPLATE = gql`
  mutation UpdateScripTemplate(
    $projectId: UUID!
    $templateId: UUID!
    $script: String!
    $title: String
  ) {
    updateScriptTemplate(
      input: {
        projectId: $projectId
        id: $templateId
        script: $script
        title: $title
      }
    ) {
      id
      script
      index
      title
    }
  }
`;

export const CREATE_SCRIPT_TEMPLATE = gql`
  mutation CreateScriptTemplate(
    $projectId: UUID!
    $script: String!
    $title: String!
  ) {
    createScriptTemplate(
      input: { projectId: $projectId, script: $script, title: $title }
    ) {
      id
      script
      title
    }
  }
`;

export const DELETE_SCRIPT_TEMPLATE = gql`
  mutation DeleteScriptTemplate($projectId: UUID!, $templateId: UUID!) {
    deleteScriptTemplate(id: $templateId, projectId: $projectId)
  }
`;

export const CREATE_SCRIPT_EXECUTION = gql`
  mutation CreateScriptExecution(
    $projectId: UUID!
    $script: String!
    $arguments: [String!]
  ) {
    createScriptExecution(
      input: { projectId: $projectId, script: $script, arguments: $arguments }
    ) {
      id
      script
      errors {
        message
        startPosition {
          offset
          line
          column
        }
        endPosition {
          offset
          line
          column
        }
      }
      logs
      value
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: UUID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const SET_EXECUTION_RESULT = gql`
  mutation SetExecutionResults(
    $resultType: ResultType!
    $rawResult: RawExecutionResult!
    $label: String
  ) {
    updateCachedExecutionResults(
      resultType: $resultType
      rawResult: $rawResult
      label: $label
    ) @client
  }
`;

export const CLEAR_EXECUTION_RESULTS = gql`
  mutation ClearExecutionResults($resultType: ResultType!) {
    clearCachedExecutionResults(resultType: $resultType) @client
  }
`;
