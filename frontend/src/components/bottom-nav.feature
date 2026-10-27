Feature: Bottom navigation
  Everybody sees Events, Map, Calendar and Profile.
  Stats is only for admins and event creators, Manage only for admins.

  Scenario: A visitor without events does not see Stats or Manage
    Given the user is a "user" with 0 events
    When the navigation is shown
    Then they see the links "Events, Map, Calendar, Profile"

  Scenario: An event creator also sees Stats
    Given the user is a "user" with 2 events
    When the navigation is shown
    Then they see the links "Events, Map, Calendar, Stats, Profile"

  Scenario: An admin sees Stats and Manage
    Given the user is a "admin" with 0 events
    When the navigation is shown
    Then they see the links "Events, Map, Calendar, Stats, Profile, Manage"
