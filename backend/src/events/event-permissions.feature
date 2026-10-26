Feature: Event permissions
  Only the owner of an event or an admin can change or delete it.
  Security lives in the backend, not in hidden buttons.

  Scenario: The owner updates their own event
    Given an event created by "user-ana"
    When "user-ana" with role "user" updates the price to 5
    Then the event is saved with price 5

  Scenario: Another user cannot update the event
    Given an event created by "user-ana"
    When "user-bob" with role "user" updates the price to 5
    Then the request is rejected as forbidden
    And the event is not saved

  Scenario: An admin can update any event
    Given an event created by "user-ana"
    When "user-admin" with role "admin" updates the price to 5
    Then the event is saved with price 5

  Scenario: Another user cannot delete the event
    Given an event created by "user-ana"
    When "user-bob" with role "user" deletes the event
    Then the request is rejected as forbidden
    And the event is not deleted

  Scenario: An invalid event id is treated as not found
    When someone asks for the event with id "123"
    Then the request is rejected as not found
