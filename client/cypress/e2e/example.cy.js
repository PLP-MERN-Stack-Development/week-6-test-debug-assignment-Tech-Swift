// cypress/e2e/example.cy.js

describe('Authentication, Registration & CRUD E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows Login and Register links on nav bar when logged out', () => {
    cy.contains('Login').should('exist');
    cy.contains('Register').should('exist');
  });

  it('navigates to login page', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('navigates to register page', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.get('form').should('exist');
  });

  it('registers a new user and redirects to login', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.get('form').should('exist');
    const username = `testuser_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    const email = `${username}@example.com`;
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type('testpassword');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('logs in with the newly registered user and creates a post', () => {
    // Register a user first
    const username = `testuser_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    const email = `${username}@example.com`;
    const password = 'testpassword';
    cy.contains('Register').click();
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/login');
    // Now login
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Debug: check for error message after login attempt
    cy.wait(500);
    cy.get('body').then($body => {
      if ($body.text().match(/error|invalid|failed/i)) {
        cy.screenshot('login-error');
        throw new Error('Login failed: ' + $body.text());
      }
    });
    cy.document().then(doc => {
      cy.log(doc.body.innerHTML);
    });
    cy.contains(/hi,|logout/i, { timeout: 10000 }).should('exist');
    // Create a post
    cy.contains('Create Post').click();
    cy.url().should('include', '/create');
    cy.get('form').should('exist');
    cy.get('input[placeholder="Title"]').type('Cypress Test Post');
    cy.get('textarea[placeholder="Content"]').type('This post was created by Cypress E2E test.');
    cy.get('select').select('tech');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Cypress Test Post').should('exist');
  });

  it('views the created post in the list', () => {
    cy.visit('/');
    cy.contains('Cypress Test Post').click();
    cy.url().should('include', '/posts/');
    cy.contains('Cypress Test Post').should('exist');
    cy.contains('This post was created by Cypress E2E test.').should('exist');
  });

  // Optional: Add a basic login attempt (adjust selectors as needed)
  it('navigates between main routes', () => {
    cy.visit('/');
    cy.contains('Posts'); // Home
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Register').click();
    cy.url().should('include', '/register');
    cy.contains('Posts').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('redirects unauthenticated user from /create to /login', () => {
    cy.visit('/create');
    cy.url().should('include', '/login');
  });

  it('navigates to post detail from post list', () => {
    cy.visit('/');
    // If there is at least one post, click it
    cy.get('[data-testid="post-title"]').first().click({ force: true });
    cy.url().should('include', '/posts/');
  });

  it('shows error on invalid login', () => {
    cy.contains('Login').click();
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains(/error|invalid|failed/i).should('exist');
  });

  it('shows error on registration with existing email', () => {
    const username = `existinguser`;
    const email = `existinguser@example.com`;
    const password = 'testpassword';
    // Register once
    cy.contains('Register').click();
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Register again with same email
    cy.contains('Register').click();
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Do NOT expect redirect; just check for error message on /register
    cy.url().should('include', '/register');
    cy.contains(/error|exists|taken|invalid/i, { timeout: 10000 }).should('exist');
  });

  it('shows error on post creation with missing fields', () => {
    // Register and login first
    const username = `edgecase_${Date.now()}_${Math.floor(Math.random()*10000)}`;
    const email = `${username}@example.com`;
    const password = 'testpassword';
    cy.contains('Register').click();
    cy.get('input[type="text"]').type(username);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains(/hi,|logout/i, { timeout: 10000 }).should('exist');
    cy.contains('Create Post').click();
    cy.url().should('include', '/create');
    // Submit with missing title
    cy.get('textarea[placeholder="Content"]').type('Missing title');
    cy.get('select').select('tech');
    cy.get('button[type="submit"]').click();
    cy.contains(/error|required|missing/i).should('exist');
  });

  it('shows 404 or not found for non-existent post', () => {
    cy.visit('/posts/doesnotexistid123');
    cy.contains(/not found|404|error/i, { timeout: 10000 }).should('exist');
  });

});
