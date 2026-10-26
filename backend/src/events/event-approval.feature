Feature: Event approval
  New events start as "pending". Only an admin can publish or reject them.
  A rejected event keeps a note so the owner knows what to fix.

  Scenario: An admin publishes a pending event
    Given a pending event
    When a user with role "admin" sets the status to "published"
    Then the event status is "published"
    And the event has no rejection note
    And the event is saved

  Scenario: An admin rejects a pending event with a note
    Given a pending event
    When a user with role "admin" rejects it with the note "Please add an image"
    Then the event status is "rejected"
    And the rejection note is "Please add an image"
    And the event is saved

  Scenario: A normal user cannot change the status
    Given a pending event
    When a user with role "user" sets the status to "published"
    Then the request is rejected as forbidden
    And the event is not saved

  Scenario: "pending" is not an allowed status to send
    When an admin sends the status "pending"
    Then the request body is invalid
