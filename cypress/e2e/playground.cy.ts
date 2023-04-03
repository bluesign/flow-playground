describe('Flow-Playground frontend tests', () => {
  const DEPLOY_BUTTON = '[data-test="deploy-button"]';
  const EXECUTE = '[data-test="execute-button"]';
  const SEND_BUTTON = '[data-test="send-button"]';
  const ACCOUNTS_LIST = '[data-test="account-list"]';
  const MONACO_EDITOR = '.monaco-editor textarea:first';
  const STATUS_MESSAGE = '[data-test="control-panel-status-message"]';
  const selectAllKeys = Cypress.platform == 'darwin' ? '{cmd}a' : '{ctrl}a';

  beforeEach(() => {
    cy.visit('/');
  });

  it.skip('deploys a contract', () => {
    cy.get(ACCOUNTS_LIST).children().should('have.length', 5).first().click();
    cy.get(DEPLOY_BUTTON).should('have.text', 'Deploy').click();
    cy.get(STATUS_MESSAGE).should('have.text', 'Please wait...');
    cy.get(DEPLOY_BUTTON).should('have.text', 'Redeploy');
    cy.get('[data-test="execution-results"]').should(
      'include.text',
      'Deployed Contract To: 0x01',
    );
  });

  it.skip('sends a transaction', () => {
    cy.get('[data-test="sidebar-Transaction"]').click();
    cy.get('[data-test="editor-heading"]').should(
      'include.text',
      'Transaction Template',
    );
    // Ensure action button is disabled when contract not deployed yet
    cy.get(SEND_BUTTON).should('be.disabled');

    // deploy contract
    cy.get(ACCOUNTS_LIST).children().first().click();
    cy.get(DEPLOY_BUTTON).should('have.text', 'Deploy').click();
    cy.get(DEPLOY_BUTTON).should('have.text', 'Redeploy');

    // open transaction template and successfully send transaction
    cy.get('[data-test="sidebar-Transaction"]').click();
    cy.get(SEND_BUTTON)
      .should('have.text', 'Send')
      .should('be.enabled')
      .click();
    cy.get('[data-test="execution-results"]').should(
      'include.text',
      'Hello, World!',
    );
  });

  it.skip('executes a script', () => {
    cy.get('[data-test="sidebar-Script"]').click();
    cy.get('[data-test="editor-heading"]').should(
      'include.text',
      'Script Template',
    );
    cy.get(EXECUTE).should('have.text', 'Execute').click();
    cy.get('[data-test="execution-results"]').should(
      'include.text',
      '{"type":"Int","value":"1"}',
    );
  });

  it.skip('reflects changes to imported contract after contract has been redeployed', () => {
    // deploy contract
    cy.get(ACCOUNTS_LIST).children().first().click();
    cy.get(DEPLOY_BUTTON).should('have.text', 'Deploy').click();
    cy.get(STATUS_MESSAGE).should('have.text', 'Please wait...');
    cy.get(DEPLOY_BUTTON).should('have.text', 'Redeploy');
    cy.get('[data-test="execution-results"]').should(
      'include.text',
      'Deployed Contract To: 0x01',
    );

    // open transaction template and successfully send transaction
    cy.get('[data-test="sidebar-Transaction"]').click();
    cy.get(SEND_BUTTON)
      .should('have.text', 'Send')
      .should('be.enabled')
      .click();
    cy.get('[data-test="execution-results"]').should(
      'include.text',
      'Hello, World!',
    );

    // edit contract
    cy.get(ACCOUNTS_LIST).children().first().click();
    cy.get(MONACO_EDITOR).click().focused().type(selectAllKeys).clear();
    cy.get(MONACO_EDITOR).should('be.empty');
    cy.get(DEPLOY_BUTTON).should('be.disabled');
    cy.get(MONACO_EDITOR)
      .click()
      .focused()
      .type(
        'access(all) contract HelloWorld { access(all) let greeting: String init() { self.greeting = "Hello, Other World!" } access(all) fun other_hello(): String {return self.greeting}}',
        { parseSpecialCharSequences: false },
      );
    cy.get(DEPLOY_BUTTON).should('be.enabled');
    cy.get(DEPLOY_BUTTON).should('have.text', 'Redeploy').click();
    cy.get('[data-test="redeploy-confirm-button"]').should('exist').click();
    cy.get(STATUS_MESSAGE).should('have.text', 'Please wait...');
    cy.get(DEPLOY_BUTTON).should('have.text', 'Redeploy');
    cy.get(DEPLOY_BUTTON).should('be.enabled');

    // select and edit transaction
    cy.get('[data-test="sidebar-Transaction"]').click();
    cy.get(SEND_BUTTON).should('have.text', 'Send').should('be.disabled');
    cy.get(MONACO_EDITOR)
      .click()
      .focused()
      .type(selectAllKeys)
      .type(
        'import HelloWorld from 0x01 transaction { prepare(acct: AuthAccount) {} execute { log(HelloWorld.other_hello())}}',
        { parseSpecialCharSequences: false },
      );

    // successfully send transaction
    cy.get(SEND_BUTTON)
      .should('have.text', 'Send')
      .should('be.enabled')
      .click();
    cy.get('[data-test="transaction-result"]').should(
      'include.text',
      'Hello, Other World!',
    );
  });
});
