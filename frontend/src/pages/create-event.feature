Feature: Create an event
  Logged-in users submit new openings with a form.
  New events wait for an admin to review them.

  Scenario: A user submits a new event
    Given the user is on the create event page
    When they fill in the form for "Night Lights" at "Galeria Test"
    And they submit the form
    Then the event is sent with the title "Night Lights" and price 0
    And they are taken to the new event's page

  Scenario: The backend rejects the event
    Given the user is on the create event page
    And the backend answers with the error "lat must not be greater than 90"
    Then they see the message "lat must not be greater than 90"
