Feature: My Events
  Users follow the events they created, with their review status.
  Rejected events show the admin's note.

  Scenario: The user sees the status of each of their events
    Given the user has a pending, a published and a rejected event
    When they open My Events
    Then they see the badges "Pending review", "Published" and "Rejected"
    And they see the admin note "Please add an image"

  Scenario: The user has not created any event yet
    Given the user has no events
    When they open My Events
    Then they see the message "You haven't created any event yet."
