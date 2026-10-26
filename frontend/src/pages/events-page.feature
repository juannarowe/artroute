Feature: Events page
  Anyone can explore the published events.
  Logged-in users also see the events they marked as "Go".

  Scenario: A visitor sees the published events as cards
    Given there are 2 published events
    When the visitor opens the events page
    Then they see the event "Light & Shadow"
    And they see the event "Blue Hours"
    And each event links to its detail page

  Scenario: The page explains when there are no events
    Given there are 0 published events
    When the visitor opens the events page
    Then they see the message "No events yet."

  Scenario: A logged-out visitor is invited to log in in the Going tab
    Given there are 2 published events
    And the visitor is logged out
    When the visitor opens the events page
    And they open the "Going" tab
    Then they see a link to log in

  Scenario: A logged-in user with no "Go" events sees an empty message
    Given there are 2 published events
    And the visitor is logged in
    When the visitor opens the events page
    And they open the "Going" tab
    Then they see the message "You haven't marked any event as Go yet."
