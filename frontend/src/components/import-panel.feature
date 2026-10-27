Feature: Import openings from ArtBarcelona
  In the Manage page, an admin imports the next openings with one button.

  Scenario: The admin starts an import
    Given the import panel is ready
    When the admin clicks "Import from ArtBarcelona"
    Then the import starts

  Scenario: The admin waits while the import runs
    Given an import is running
    Then the button says "Importing... (about 30 s)" and is disabled

  Scenario: The admin sees the result of the import
    Given an import finished with 3 imported and 7 skipped
    Then they see the message "3 imported, 7 skipped."
