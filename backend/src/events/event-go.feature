Feature: Going to an event
  The "Go" button works like a switch: the first click adds the user
  to the attendees, the second click removes them.

  Scenario: A user marks "Go" on a published event
    Given a published event without attendees
    When "user-ana" clicks Go
    Then "user-ana" is in the attendees
    And the event is saved

  Scenario: A user clicks Go again to cancel
    Given a published event where "user-ana" is going
    When "user-ana" clicks Go
    Then "user-ana" is not in the attendees
    And the event is saved

  Scenario: Nobody can go to an event that is not published yet
    Given a pending event without attendees
    When "user-ana" clicks Go
    Then the request is rejected as a bad request
    And the event is not saved
