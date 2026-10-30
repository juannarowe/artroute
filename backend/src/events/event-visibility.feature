Feature: Event visibility
  Visitors only see published events.
  Pending and rejected events are visible only to their owner and to admins.

  Scenario: A visitor only gets published events
    When a visitor lists the events
    Then the database is searched with the status "published"

  Scenario: A visitor cannot list pending events
    When a visitor lists the events with the status "pending"
    Then the request is rejected as forbidden

  Scenario: A user lists all their own events
    When "user-ana" with role "user" lists the events of "user-ana"
    Then the database is searched without a status filter

  Scenario: A user only gets the published events of another user
    When "user-bob" with role "user" lists the events of "user-ana"
    Then the database is searched with the status "published"

  Scenario: An admin lists the pending events
    When "user-admin" with role "admin" lists the events with the status "pending"
    Then the database is searched with the status "pending"

  Scenario: A visitor cannot open a pending event
    Given a "pending" event created by "user-ana"
    When a visitor opens the event
    Then the request is rejected as not found

  Scenario: The owner opens their pending event
    Given a "pending" event created by "user-ana"
    When "user-ana" with role "user" opens the event
    Then the event is returned

  Scenario: An admin opens a rejected event
    Given a "rejected" event created by "user-ana"
    When "user-admin" with role "admin" opens the event
    Then the event is returned
