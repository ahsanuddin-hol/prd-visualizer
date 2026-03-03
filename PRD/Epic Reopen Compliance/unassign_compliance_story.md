# Unassign Compliance Story

**Story**
As an Admin / User with permission
I want to be able to unassign compliance from user group and user
So that the obligation returns to the "Enforced" (Unassigned) state and can be re-assigned to the correct stakeholders.

**Acceptance Criteria**

**Scenario 1: Unassigning via Edit Form Setup**
Given the obligation status is "Assigned"
When I click the "Setup Compliance" (ID: "Atur Kepatuhan") button
And I clear the "Assignee" and "Verifikator" fields
And I click "Save Change" (ID: "Simpan Perubahan")
Then 
the status badge should change to "Unassigned" (or Enforced) (ID: "Belum Ditugaskan")
And the Enforced Date should be updated to today
And I should see a toast message "Success! Compliance has been set up." (ID: "Berhasil! Kepatuhan telah diatur.")
And the system logs the activity "Setup this obligation" (ID: "Mengatur kewajiban ini")

**Scenario 2: Validation on Unassign (Restricted State)**
Given the obligation status is "Ready to Review" or "Comply"
When I try to save the form with cleared Assignee or Verifikator
Then 
If Ready to Review: I should see an error toast message "Failed! Cannot remove assignee or verificator while on review." (ID: "Gagal! Tidak dapat menghapus Assignee atau Verificator saat dalam tinjauan.")
Or If Audited: "Failed! Cannot remove assignee or verificator when complied." (ID: "Gagal! Tidak dapat menghapus Assignee atau Verificator saat sudah patuh.")
And the changes should not be saved

**Scenario 3: Update Stepper UI**
Given I have successfully unassigned the obligation
Then 
the "Assigned" step in the header stepper should become inactive (Grey circle)
And the "Enforced" step should remain active with the new date
