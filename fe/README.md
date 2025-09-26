## Getting Started
Make sure to populate your `.env` files first.

To start for the first time, run:

```
docker compose up -d --build
```

After building the image for the first time, to improve speed, you don't need to rebuild it:

```
docker compose up -d
```

Second, run development for web

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📝 Commit Convention

We follow a [standardized commit message](https://conventionalcommits.org) format to maintain a clean and informative git history. Each commit message should be structured as follows:

```
<type>(<scope>): <subject>
```

### Types:

-   **feat**: A new feature
-   **fix**: A bug fix
-   **build**: Changes to libraries, etc
-   **docs**: Documentation changes
-   **refactor**: Code changes that neither fix a bug nor add a feature
-   **perf**: Changes that improve performance
-   **test**: Adding or updating tests
-   **chore**: Changes to build process, auxiliary tools, or libraries

### Scope:

The scope is optional and can be anything specifying the place of the commit change (component, page, or file name).

### Subject:

The subject contains a brief description of the change:

-   Use the imperative, present tense: "change" not "changed" nor "changes"
-   Don't capitalize the first letter
-   No period (.) at the end

### Examples:

```
feat(auth): add login page
fix(navbar): correct responsive display issue
docs(readme): update installation instructions
refactor(api): improve error handling
```

## 🌿 Branch Convention

To maintain an organized repository, we use the following branch naming convention:

```
<type>/<description>
```

### Types:

-   **feat**: For developing new features
-   **fix**: For fixing bugs
-   **docs**: For documentation updates
-   **refactor**: For code refactoring that doesn't add new features or fix bugs

### Description:

A brief description using kebab-case (words separated by hyphens) that captures what the branch is about.

### Examples:

```
feat/landing-page
fix/login-validation
docs/api-documentation
refactor/cleanup-components
```

### Workflow:

1. Create a new branch from `main` (or current development branch) `git checkout -b <branch-name>`
2. Work on your changes
3. Submit a pull request back to the original branch
4. After review, merge the branch
