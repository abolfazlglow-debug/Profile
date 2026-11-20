# AXVORQ Launch Package

Static Persian/English site with Supabase-backed authentication, public content, and a Google Apps Script submission bridge.

## Deployment
1. Publish this folder as the root of the GitHub Pages repository or other static host.
2. Preserve the `assets`, `partials`, and `google-apps-script` folders.
3. Confirm `www.axvorq.ir` is the canonical domain and redirect the apex domain to it.
4. Replace the temporary AX monogram assets in `assets/images/` with the confirmed official logo files when the exact GitHub raw URL/source is provided.
5. Run `supabase-setup.sql` in Supabase SQL Editor.
6. Create/confirm the owner account, then run the commented promotion SQL with the owner's exact email to set the first `super_admin`.
7. Deploy `google-apps-script/Code.gs` as a Web App, execute as the spreadsheet owner, and set access to anyone as required by the public submission endpoint. Update the endpoint in `assets/js/google-sheets-config.js` if deployment creates a new URL.
8. Confirm the Google Sheet has a `Submissions` sheet with headers matching `submission_id, submission_type, name, email, role_or_category, portfolio_url, message, status, assigned_to, created_at, updated_at, internal_note`. Header names may be reordered; the script maps by header.
9. Configure Supabase Auth email redirect URLs and Google OAuth provider for the production domain if Google login is desired.
10. Open each form and perform controlled test submissions, then confirm the actual spreadsheet row.

## Local preview
Run a local HTTP server from this folder (for example `python -m http.server 8000`) and visit `http://localhost:8000`. Opening HTML directly with `file://` is not supported because partials and API fetches need HTTP.

## Admin panel
The admin panel includes request/project status updates and deletion, user role assignment via a protected RPC, expert CRUD, article CRUD, search/filtering, and CSV reports. Expert permission labels are stored as metadata; they are not granular security grants. Database RLS and role checks enforce the actual access boundary.

## Important test status
Static code checks are recorded in `FINAL_LAUNCH_REPORT_FA.md`. Live Google Sheets/Supabase/auth/OAuth tests and Lighthouse/PageSpeed measurements were not performed in this environment because external DNS/network access was unavailable. Do not consider the site fully launch-verified until those checks pass in production.
