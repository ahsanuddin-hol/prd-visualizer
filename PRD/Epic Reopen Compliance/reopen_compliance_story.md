# Reopen Compliance Story

**Story**
As an Admin / User role with permission
I want to be able to reopen a compliance obligation that has been marked as "Comply" (Audited)
So that I can revert it to the "Assigned" status to correct mistakes or update information without creating a new obligation.

**Acceptance Criteria**

**Scenario 1: Accessing Reopen Option**
Given the obligation status is "Comply"
When I open the "More" (...) menu
Then
I should see the option text "Reopen" (ID: "Buka Kembali")

**Scenario 2: Reopen Confirmation Modal (UI Copy)**
Given I have clicked the "Reopen" option
Then
I should see a modal with the title "Reopen Compliance" (ID: "Buka Kembali Kepatuhan")
And the modal body text should be "Are you sure to reopen this compliance? Progress will be back to Assigned." (ID: "Apakah Anda yakin ingin membuka kembali kepatuhan ini? Progres akan kembali ke status Ditugaskan.")
> *Note: Stage “Assigned” (ID: “Ditugaskan”) is dynamic from database value*
And I should see a secondary button "Cancel" (ID: "Batal")
And I should see a primary button "Yes, Reopen" (ID: "Ya, Buka Kembali")

**Scenario 3: Successful Reopen Action**
Given I am on the confirmation modal
When I click "Yes, Reopen"
Then
the status badge should change to "In Progress" (ID: "Proses Pemenuhan")
And I should see a toast message "Success! Compliance has been reopened." (ID: "Berhasil! Kepatuhan telah dibuka kembali.")
And a new activity log should appear with text "Reopen this obligation back to In Progress from Comply" (ID: "Membuka kembali kewajiban ini ke status Proses Pemenuhan dari Patuh")
