# WykSofts authentication email setup

These templates reproduce the dark-card structure of the existing Nomp authentication email while replacing its purple wellness branding with the WykSofts cream, orange, and black system.

## Supabase configuration

- Site URL: `https://wyksoftsinc.com`
- Allowed redirect URL: `https://wyksoftsinc.com/admin/reset-password/`
- Sender name: `WykSofts Inc.`
- Sender email: `hello@wyksoftsinc.com`
- Recovery subject: `Reset your WykSofts password`
- Confirmation subject: `Confirm your WykSofts administrator account`

Paste `recovery.html` into the **Reset password** email template and `confirmation.html` into the **Confirm signup** template.

Custom SMTP also requires the Zoho SMTP host, port, username, and an app-specific password. Enter the password directly in the Supabase dashboard; never commit it to this repository.
