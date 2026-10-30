Feature: Event lifecycle through the API (integration)
  The real API (guard, validation, controllers, services and MongoDB)
  handles an event from its creation to its publication.

  Scenario: A visitor cannot create an event
    When a visitor without a token creates an event
    Then the API answers 401

  Scenario: The server decides the status, not the user
    When "ana" creates an event that says it is already "published"
    Then the API answers 400

  Scenario: A new event waits for an admin before it is public
    When "ana" creates an event
    Then the API answers 201
    And the event is "pending" and created by "ana"
    And the public list of published events is empty
    And a visitor without a token cannot open the event

  Scenario: An admin publishes the event and users can go
    Given "ana" created an event
    And "boss" is an admin
    When "boss" publishes the event
    Then the public list of published events has 1 event
    When "leo" marks Go on the event
    Then the event has 1 attendee

  Scenario: Only the owner or an admin can delete an event
    Given "ana" created an event
    When "leo" deletes the event
    Then the API answers 403
    When "ana" deletes the event
    Then the API answers 204
