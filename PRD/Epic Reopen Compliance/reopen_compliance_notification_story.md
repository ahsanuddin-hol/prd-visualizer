# Reopen Compliance Notification Story

**Story**
As an **Assignee**
I want to be **notified when my obligation compliance is reopened**
So that **I know which obligation I should work on**

**Acceptance Criteria**

**Scenario 1: Assignee receives notification**
Given an obligation is assigned to a user (Assignee)
When another user (e.g., Admin or Verifier) reopens the obligation
Then the Assignee should receive a notification via:
1.  **In-App Notification**
2.  **Email Notification**

**1. In-App Notification**
*   **Trigger:** Obligation status changes from "Comply" to "In Progress" (Reopened).
*   **Recipient:** The assigned user (Assignee).
*   **Content:**
    *   **Title (EN):** `[user_name] - [privilege] has reopen one of your obligation in compliance monitor.`
    *   **Title (ID):** `[user_name] - [privilege] telah membuka kembali salah satu kewajiban Anda di compliance monitor.`
    *   **Body:**
        *   Obligation Code
        *   Priority Label
        *   Status Label (New Status: In Progress)
        *   Obligation Alias Name (or Obligation Name if Alias is not available)
        *   Timestamp

**2. Email Notification**
*   **Trigger:** Obligation status changes from "Comply" to "In Progress" (Reopened).
*   **Recipient:** The assigned user (Assignee).
*   **Content (EN):**
    *   **Subject:** `RCS Assignment: There is one of your obligation reopened in Compliance Monitor.`
    *   **Body Title:** `RCS Assignment: There is one of your obligation reopened in Compliance Monitor.`
    *   **Body Content:**
        > Hello, [name]
        >
        > [user_name] - [privilege] has reopen one of your obligation in compliance monitor. Please kindly check the changes by clicking one of the buttons below.
        >
        > [Button: View Obligation]
        >
        > If the button does not work kindly access the link below.
        >
        > [URL]
*   **Content (ID):**
    *   **Subject:** `Penugasan RCS: Ada kewajiban Anda yang dibuka kembali di Compliance Monitor.`
    *   **Body Title:** `Penugasan RCS: Ada kewajiban Anda yang dibuka kembali di Compliance Monitor.`
    *   **Body Content:**
        > Halo, [name]
        >
        > [user_name] - [privilege] telah membuka kembali salah satu kewajiban Anda di compliance monitor.. Silakan klik salah satu tombol di bawah ini untuk melihat rinciannya.
        >
        > [Button: Lihat Kewajiban]
        >
        > Jika tombol di atas tidak berfungsi, silakan akses link di bawah ini.
        >
        > [URL]
