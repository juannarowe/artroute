Feature: Register
  New visitors can create an account with their name, email and password.
  If something goes wrong, they see a clear message.

  Scenario: A visitor creates an account
    Given the visitor is on the register page
    When they fill in "Ana", "ana@test.dev" and "secret123"
    And they submit the form
    Then their account is created with those details
    And they are taken to the events page

  Scenario: The email already has an account
    Given the visitor is on the register page
    And the email "ana@test.dev" is already registered
    When they fill in "Ana", "ana@test.dev" and "secret123"
    And they submit the form
    Then they see the message "This email already has an account. Try logging in."
    And they stay on the register page
