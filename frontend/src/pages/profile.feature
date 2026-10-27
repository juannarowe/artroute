Feature: Profile
  Logged-in users see their personal data and can change their name.

  Scenario: The user sees their personal data
    Given the logged-in user is "Ana" with the email "ana@test.dev" and the role "user"
    When they open their profile
    Then they see the email "ana@test.dev"
    And they see the role "user"
    And the name field shows "Ana"

  Scenario: The user changes their name
    Given the logged-in user is "Ana" with the email "ana@test.dev" and the role "user"
    When they open their profile
    And they change the name to "Ana García" and save
    Then the new name "Ana García" is sent
