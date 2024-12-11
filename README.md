# Focus Loop Web Client

## Table of Contents

1. [Setup](#setup)
   1. [Installation](#installation)
   2. [Development Server](#development-server)
   3. [Production](#production)
   4. [Deployment](#deployment)
   5. [Formatting & Linting](#formatting--linting)

## Setup

### Installation

Make sure to install dependencies:

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3037`:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
# SSR
npm run build

# SPA
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

### Deployment

This project uses [GitHub Actions](https://github.com/features/actions) ([docs](https://docs.github.com/en/actions)) for automated deployment. The workflow is defined in the `.github/workflows/deploy.yml` file.

When code is pushed to the main branch, the workflow is triggered, and it performs the following steps:

1. Installs dependencies
2. Builds the application for production
3. Deploys the built files to the hosting platform

You can view the deployment status and history in the **GitHub Actions** tab.

### Formatting & Linting

This project adheres to a specific coding style and formatting guidelines. To ensure consistency, we use [ESLint](https://www.npmjs.com/package/eslint) and [Prettier](https://www.npmjs.com/package/prettier).

To format your code, run:

```bash
npm run format
```

To lint your code, run:

```bash
npm run lint
```

Additionally, we use [Git hooks](https://git-scm.com/docs/githooks) to enforce formatting and linting rules on commit. This is configured using [Husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged), as specified in the `.husky` and `.lintstagedrc` files.

When you commit code, the following checks are performed:

- Code is formatted using **Prettier**
- Code is linted & fixed using **ESLint**

If any issues are found, the commit will be rejected, and you will need to fix the issues before committing again.

By following these guidelines, we maintain a clean and readable codebase.
