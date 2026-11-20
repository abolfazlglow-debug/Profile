# AXVORQ — Deployment Package

This is a static-site package. **Publish the contents of this folder at the website root** (do not publish the enclosing `axvorq_seo_v2` folder). Keep the directory structure intact.

## GitHub Pages upload
1. Extract this ZIP on your computer. Open the extracted `axvorq_seo_v2` folder.
2. Upload its contents to the repository root: `index.html`, page HTML files, `assets/`, `partials/`, `google-apps-script/`, and configuration/docs.
3. Do not upload only `index.html`; all linked assets and scripts are required.
4. Preserve filename case exactly. GitHub Pages is case-sensitive.
5. In repository Settings → Pages, confirm the published branch and root (`/`) or the intended deployment source.
6. Confirm the custom domain and HTTPS are enabled.
7. After publishing, hard-refresh the site and test the asset URLs listed in `DEPLOY_CHECKLIST_FA.md`.

## Local preview
Run an HTTP server from this folder (not `file://`):
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Supabase
- The browser uses the public publishable/anon key only. Never put a Supabase `service_role` key in this site.
- Run `supabase-setup.sql` in the Supabase SQL Editor and verify RLS policies.
- Configure Authentication → URL Configuration: Site URL and Redirect URLs must include the production callback destinations (for example `https://www.axvorq.ir/**` and the exact dashboard/recovery URLs).
- Enable Google under Authentication → Providers, configure Google OAuth credentials, and set the Supabase callback URL shown by Supabase in Google Cloud Console.
- Test Google login after configuration; code alone cannot enable provider credentials or allowlisted redirect URLs.

## Google Sheets
- Deploy `google-apps-script/Code.gs` as a Web App using the required access setting.
- Confirm the endpoint in `assets/js/google-sheets-config.js` matches the active deployment.
- Verify the `Submissions` sheet headers against `GOOGLE_SHEETS_CONNECTION_FA.md`.

## Test limitation
This package has static checks and local-path validation. Live authentication, Google OAuth, Apps Script writes, DNS/hosting and browser performance tests must be verified after deployment.
