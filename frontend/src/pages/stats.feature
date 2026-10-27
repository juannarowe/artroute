Feature: Stats
  Admins see the stats of every event.
  Other users see the stats of the events they created.

  Scenario: An admin sees the totals and the most popular event
    Given the logged-in user is an admin
    And there are 2 published events with 3 and 1 going, and 1 pending event
    When they open the stats page
    Then they see 3 "Events", 2 "Published", 1 "Pending review" and 4 "Going"
    And the most popular event is "Blue Hours"

  Scenario: A user who has not created events is invited to create one
    Given the logged-in user is a normal user
    And they have not created any event
    When they open the stats page
    Then they see a link to create an event
