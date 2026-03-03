# Inactive Compliance Constraints Story

**Story**
As a User
I want the system to restrict actions when a compliance is "Inactive"
So that no further data modification or workflow progression occurs on an inactivated obligation.

**Acceptance Criteria**

**Scenario 1: Hidden Action Buttons**
Given the obligation status is "Inactive" (ID: "Tidak Aktif")
Then
The top action buttons should be hidden:
"Claim" / "Approval" / "Renew" / "Inactivate" buttons are NOT visible
"Setup Compliance" (ID: "Atur Kepatuhan") is NOT visible
"Add New Checklist" and "Attach" buttons are NOT visible in checklist tab
"Claim All" and "Unclaim All" buttons are NOT visible in checklist tab
Checkbox of each checklist disabled
"Edit Checklist" and "Delete Checklist" buttons are NOT visible in checklist detail popup

**Scenario 2: Restricted Dropdown Menu**
Given the obligation status is "Inactive"
When I open the "More" (...) menu
Then
I should ONLY see the following options:
"Duplicate" (ID: "Duplikat")
"Bookmark" (ID: "Tandai")
"Share" (ID: "Bagikan")
And restricted options should NOT be visible:
"Edit Alias", "Reopen", "Inactivate"
