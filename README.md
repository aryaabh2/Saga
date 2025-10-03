# Saga

Saga is a gentle, three-step web experience for older adults to upload cherished photos and notes so that the platform can shape them into a shareable saga. This project is a front-end mock built with React, Material UI, and Vite.

## Features

- **Accessible flow** with large typography and simple language tailored for older storytellers.
- **Drag-and-drop uploader** for images with text guidance fields.
- **Processing screen** that simulates AI generation with a five-second progress indicator.
- **Saga summary** with downloadable JSON output that captures the generated moments and notes.

## Getting started locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the printed local address in your browser to explore the experience.

> **Note:** If package installation fails due to network restrictions, you can still review the source code, but the development server will require the dependencies listed in `package.json`.

## Linting

Run ESLint to check for code style issues:

```bash
npm run lint
```

## Building for production

```bash
npm run build
```

This outputs the static site to the `dist` directory.

## Deploying to GitHub Pages

The project is configured with `vite.config.js` to serve from a relative base path so it can be hosted from a repository root or a GitHub Pages project site.

To deploy:

1. If you haven't already, enable GitHub Pages for the repository (Settings → Pages → Build and deployment → GitHub Actions or Deploy from a branch).
2. Build the project locally:

   ```bash
   npm run build
   ```

3. Commit and push the contents of the `dist` folder to the branch GitHub Pages serves from (for example, the `gh-pages` branch). You can automate this with the official `peaceiris/actions-gh-pages` GitHub Action. A minimal workflow is shown below:

   ```yaml
   name: Deploy Saga saga mock

   on:
     push:
       branches:
         - main

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

   This workflow builds the site on every push to `main` and publishes it to the `gh-pages` branch automatically.

4. After the workflow completes (or after you manually push the `dist` folder), visit the GitHub Pages URL shown in the repository settings to view Saga online.

## License

This project is licensed under the MIT License.
