# ASTRA: ZERO HOUR

Two-page event site for the ASTRA intercollege defence problem-solving contest.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL` to the final public site origin.
4. Set `NEXT_PUBLIC_GOOGLE_FORM_URL` to the participant Google Form URL. Until then, the registration page marks the link as pending and disables the button.
5. Run `npm install`, then `npm run dev` and open `http://localhost:3000`.

For a production build, run `npm run build` and `npm start`.

## Content to confirm before launch

- Publish the Google Form and make **College name** a required field. The team cap is five people total (leader plus up to four teammates). The current page lists the team details the form should collect; it does not collect or transmit participant data itself.
- Confirm the venue, schedule times, guest, sponsors, and event contact details before replacing their placeholders.
- Keep the public event to the two confirmed operations: **Operation: Black Box** and **Operation: Compromised Node**. Do not publish the hidden twist details or internal organising-team duties.
- Keep the compromised station unmarked in public network artwork. The source diagram highlights a station, so the website uses a neutral eight-node redraw.
- Update the default site origin in the deployment environment so canonical URLs, sitemap, robots, and Event JSON-LD use the real domain.
- Submit the production sitemap in Google Search Console after deployment.

The countdown targets the start of 03 December 2026 in India Standard Time because an event start time has not been confirmed.
