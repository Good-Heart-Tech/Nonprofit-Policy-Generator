# Nonprofit Policy Generator

Created and hosted by [Good Heart Tech](https://goodheart.tech), this application helps nonprofit organizations generate essential policies through an intuitive wizard interface.

## About Good Heart Tech

Good Heart Tech is dedicated to supporting nonprofit organizations by providing accessible, technology-driven solutions. We believe in empowering nonprofits with the tools they need to operate effectively and securely in the digital age.

## About the Application

This is a single static site (plain HTML/CSS/vanilla JS, no build step) deployed as one Cloudflare Pages project with path-based routing. It hosts a hub page plus four policy wizards:

- `/privacy/` — Privacy & Cookies Policy Generator
- `/acceptable-use/` — Acceptable Use Policy Generator
- `/ai-use/` — Artificial Intelligence Use Policy Generator
- `/mobile-device/` — Mobile Device Policy Generator

### How It Works

When you launch any of the generators, you'll be guided through a series of questions about your organization. Based on your responses, the system will instantly generate a customized policy document that aligns with your organization's needs.

### Structure

- `index.html`, `styles.css`, `script.js` — the hub landing page
- `shared/engine.js` — the wizard engine shared by every policy generator: step navigation, the progress bar, the skip-a-step logic (`data-skip-if`), markdown-to-HTML rendering, and copy-to-clipboard. Each policy page supplies its own step markup plus `window.generatePolicyContent()` (and optionally `window.validateStep()` / `window.onWizardInit()`)
- `shared/styles.css` — the CSS shared by every wizard page
- `privacy/`, `acceptable-use/`, `ai-use/`, `mobile-device/` — one folder per policy generator, each with its own `index.html` and `script.js`
- `disclaimer.html`, `PrivacyPolicy.html` — shared pages linked to from every policy generator

### Open Source Commitment

This application is fully open source, allowing complete transparency in our policy generation process. You can review all aspects of how policies are generated, ensuring trust and reliability in the final output.

### Disclaimer

Please review our [full disclaimer](/disclaimer.html) before using this application. The disclaimer contains important information about the limitations of our service and your responsibilities when using generated policies.

**We strongly recommend having any generated policy reviewed and updated by qualified legal counsel before implementation or distribution to ensure it meets your specific needs and complies with all applicable laws and regulations.**

## License

This project is open source and available under the GNU General Public License v3.0.
