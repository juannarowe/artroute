Feature: Edit profile
  Logged-in users can change the name shown in their profile.
  They cannot change their role.

  Scenario: A user changes their name
    Given a user called "Ana"
    When they change their name to "Ana García"
    Then their name is "Ana García"
    And the user is saved

  Scenario: The name cannot be too short
    When a user sends the name "A"
    Then the request body is invalid

  Scenario: The role cannot be sent
    When a user sends the name "Ana" and the role "admin"
    Then the role is not accepted
