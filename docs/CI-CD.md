# CI/CD — how this portfolio ships

> A short primer on the pipeline, why it's set up this way, and how to operate it.

---

## The 30-second version

**CI** = Continuous Integration. Every time code is pushed, automated checks run to verify it isn't broken.
**CD** = Continuous Deployment. Every time main is updated, the live site auto-deploys.

For this project:

```
You push to main
       │
       ├──► GitHub Actions runs CI  (lint • typecheck • build)
       │         │
       │         ├──► ✅ passes → main is healthy
       │         └──► ❌ fails  → red ✗ next to the commit, you fix it
       │
       └──► Vercel runs CD          (npm ci → next build → deploy)
                 │
                 ├──► ✅ passes → live at your domain in ~90s
                 └──► ❌ fails  → previous deploy stays live, no downtime
```

GitHub Actions and Vercel run **in parallel**, not sequentially. They both observe the same git event.

---

## Why two systems?

Vercel already runs `next build`. So why also run CI on GitHub Actions?

| Concern | Vercel handles it? | GitHub Actions handles it? |
|---|---|---|
| Deploy production | ✅ | ❌ |
| Preview deploys per PR | ✅ | ❌ |
| Fail PRs that don't compile | ⚠️ slow + tangled with deploy | ✅ fast, isolated step |
| Block merges on red CI | ❌ | ✅ |
| Security scanning | ❌ | ✅ |
| Dependency auto-updates | ❌ | ✅ |

GitHub Actions is the **gatekeeper** — checks land in the PR as required status checks, blocking merge if anything fails. Vercel is the **deployer** — once code is on main, Vercel ships it.

---

## The files

### `.github/workflows/ci.yml`

Three checks per push, all on `ubuntu-latest`:

1. **`npm ci`** — installs deps from lockfile exactly (no resolution surprises)
2. **`npm run lint`** — ESLint catches code-style and common-bug patterns
3. **`npx tsc --noEmit`** — TypeScript catches type errors
4. **`npm run build`** — proves the production build compiles

**Key choices:**

- **Separate steps, not one big script** — when something fails you see immediately *which* check broke without scrolling through logs.
- **`npm ci` not `npm install`** — strict, reproducible, ~2× faster in CI.
- **`cache: 'npm'` on setup-node** — caches `~/.npm` keyed by lockfile hash; subsequent runs skip dependency download.
- **`concurrency` block** — when you push 3 times in a minute, the older runs get cancelled. Saves GitHub Actions minutes.
- **`permissions: contents: read`** — workflow can read the repo but can't push back. If a malicious dep ran in CI, it couldn't tamper.
- **`timeout-minutes: 10`** — emergency brake; normal runs are ~2 min.

### `.github/dependabot.yml`

Every Monday at 8 AM Kathmandu time, Dependabot opens PRs for outdated dependencies. Your CI workflow runs against each PR. Green → merge with confidence. Red → known incompatibility, decide whether to investigate or skip.

**Key choices:**

- **`groups`** — minor/patch updates batched into a single PR; major updates stay separate so you review each one.
- **`open-pull-requests-limit: 5`** — caps Dependabot inbox so it doesn't drown you in PRs after long quiet periods.
- **Updates the GitHub Actions themselves too** — easy to forget that `actions/checkout@v4` is a dependency that ages.

### `.github/workflows/codeql.yml`

GitHub's free semantic security scanner. Catches things `npm audit` misses because it understands code flow, not just package versions.

**Findings appear in:** repo → **Security** tab → **Code scanning**.

---

## How to read a run

### Green ✅
Nothing to do. Code is safe to merge.

### Red ❌ — how to debug
1. Click the red ✗ next to your commit on GitHub
2. Click "Details" on the failing check
3. Expand the step that failed (it'll have its own ✗)
4. The error is at the bottom of the step's log — scroll up only if you need context

### Cancelled ⊘
Usually means you pushed a newer commit before the previous run finished. The `concurrency` block in `ci.yml` cancels the old run on purpose. Look at the run for your latest commit instead.

---

## What to do in GitHub's UI (one-time setup)

GitHub Actions creates the workflow, but **branch protection** is a setting you toggle in the UI.

### Enable branch protection on `main`

1. Go to `https://github.com/sumeetm10/Portfolio/settings/branches`
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Check these boxes:
   - ☑ **Require a pull request before merging** (forces use of PRs, not direct commits)
   - ☑ **Require status checks to pass before merging**
     - Search and select: `Lint, typecheck, build` (this is the job name from ci.yml)
   - ☑ **Require branches to be up to date before merging**
   - ☑ **Do not allow bypassing the above settings** (applies even to admins)
5. Click **Create**

After this, you can't push broken code to main even by accident. Every change goes through a PR; every PR must be green before merge.

**Caveat for solo devs:** if you set this AND you're the only contributor, you'll have to PR your own changes from a feature branch. That's slightly more friction but a great habit — and it means Vercel gives you a preview URL on every PR to verify the change before merging.

### Enable Dependabot security updates (free, separate from version-bump PRs)

1. Go to `https://github.com/sumeetm10/Portfolio/settings/security_analysis`
2. Enable **Dependabot alerts** + **Dependabot security updates**

This is different from the version-bump PRs the `dependabot.yml` file creates — security updates land as urgent PRs the moment a CVE is published, not on the Monday schedule.

---

## What's still NOT automated (intentionally)

- **Tests** — you don't have any yet. When you add a `tests/` folder, add `npm test` as a step in `ci.yml`.
- **Lighthouse / performance budgets** — there's a `lhci-action` you can add. Good for v2.
- **Automatic releases / changelog** — overkill for a portfolio. Add it when you have users.
- **End-to-end tests against the preview URL** — Playwright + Vercel preview URL is the typical setup. Overkill until you have meaningful interactive flows.

---

## Quick reference

```bash
# Run locally what CI runs in the cloud
npm ci                # exact install
npm run lint          # eslint
npx tsc --noEmit      # typecheck
npm run build         # production build

# Trigger the workflow manually (without pushing)
# → GitHub repo → Actions tab → CI workflow → "Run workflow" button
```
