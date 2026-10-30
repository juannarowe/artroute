Feature: Event detail page
  The page tells the user what went wrong:
  an event that does not exist is not the same as a server or connection problem.

  Scenario: The event does not exist
    Given the API answers that the event was not found
    When the visitor opens the event page
    Then they see the message "Event not found."
    And they see a link back to the events

  Scenario: The server or the connection fails
    Given the API cannot load the event
    When the visitor opens the event page
    Then they see the message "We couldn't load this event. Check your connection and try again."
    And they can try again

  Scenario: Marking Go fails
    Given a published event
    And the visitor is logged in
    And marking Go fails with "Could not reach the server. Check your connection."
    When the visitor opens the event page
    Then they see the message "We couldn't update your Go. Could not reach the server. Check your connection."
