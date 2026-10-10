# Git commits and pushes

How commits are written and pushed in this repo. The message conventions come
from this repo's own history; the push rules are adapted from
`.cursor/rules/git-commit-hygiene.mdc`.

## When

- Commit or push only when asked. Finishing a change is not a request to commit it.

## Messages

- Conventional Commits, as the history already uses: `type(scope): summary`.
- Types in use: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, `a11y`.
- Scope is the section or area touched: `hero`, `experience`, `competitions`,
  `work`, `skills`, `contact`, `nav`, `resume`, `content`, `cursor`. Leave it
  out for changes that cut across sections.
- Summary in lower case, no full stop, describing what a visitor or the next
  developer will notice ("left-align a wrapped last row"), not the mechanics
  ("change justify-content").
- Add a body only when the reason isn't obvious from the summary.
- One logical change per commit. Work on two sections is two commits.

## Before committing

- `npx tsc --noEmit` and `npm run lint` both pass.
- Read `git status` and stage by name. Leave out scratch output (`drafts/`),
  anything under `private/`, and env files.
- If `src/content/*` changed, `CONTENT.md` is updated in the same commit.
- Call out new media over about 5 MB before committing it: it stays in the
  repo's history for good.

## Pushing

- After an amend, rebase or reset, push with `git push --force-with-lease`,
  never plain `--force`. If the lease is rejected, stop and show what changed
  upstream.
- Never force-push `main` unless explicitly asked to.
- Before pushing rewritten history, run `git log --oneline origin/main..HEAD`
  and check the commits are the expected ones.
- After a push, report the branch and the commits that are now on it.
