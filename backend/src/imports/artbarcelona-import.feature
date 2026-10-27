Feature: Import openings from ArtBarcelona
  An admin imports upcoming openings from the ArtBarcelona (GRAF) agenda.
  The AI fills in the details and every imported event waits for approval.

  Scenario: An admin imports new openings as pending events
    Given the agenda has 2 new openings
    And the AI can read every opening
    When a user with role "admin" runs the import
    Then the result is 2 imported and 0 skipped
    And every saved event is "pending" and created by "artbarcelona-import"

  Scenario: Openings that were already imported are skipped
    Given the agenda has 2 openings that are already in the database
    When a user with role "admin" runs the import
    Then the result is 0 imported and 2 skipped
    And no event is saved

  Scenario: Openings without AI details or coordinates are skipped
    Given the agenda has 2 new openings
    And the AI cannot read the first opening
    And the address of the second opening is not found on the map
    When a user with role "admin" runs the import
    Then the result is 0 imported and 2 skipped
    And no event is saved

  Scenario: One run imports at most 10 openings
    Given the agenda has 12 new openings
    And the AI can read every opening
    When a user with role "admin" runs the import
    Then the result is 10 imported and 0 skipped

  Scenario: A normal user cannot import
    Given the agenda has 2 new openings
    When a user with role "user" runs the import
    Then the import is forbidden
    And no event is saved
