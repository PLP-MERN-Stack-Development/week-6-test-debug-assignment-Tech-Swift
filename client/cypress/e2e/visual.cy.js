// Visual regression tests using cypress-image-snapshot

describe('Visual Regression', () => {
  it('Home page looks correct', () => {
    cy.visit('/');
    cy.wait(1000); // wait for UI to settle if needed
    cy.matchImageSnapshot('home-page');
  });

  it('Login page looks correct', () => {
    cy.visit('/login');
    cy.wait(500);
    cy.matchImageSnapshot('login-page');
  });

  it('Register page looks correct', () => {
    cy.visit('/register');
    cy.wait(500);
    cy.matchImageSnapshot('register-page');
  });

  // Add more tests for other components or pages as needed
});
