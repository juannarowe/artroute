Feature: Auth guard
  Write endpoints need a valid Firebase token.
  The guard tells the controllers who is calling and with which role.

  Scenario: A request without a token is rejected
    Given a request without an Authorization header
    When the guard checks the request
    Then the request is rejected as unauthorized

  Scenario: A request with an invalid token is rejected
    Given a request with the token "fake-token"
    And Firebase says the token is invalid
    When the guard checks the request
    Then the request is rejected as unauthorized

  Scenario: A request with a valid token is allowed
    Given a request with the token "valid-token"
    And Firebase says the token belongs to "user-ana"
    And "user-ana" has the role "admin" in the database
    When the guard checks the request
    Then the request is allowed
    And the request knows the user is "user-ana" with role "admin"
