# CreatorComped — Claude Code Guidelines

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

### Available gstack skills

| Skill | When to use |
|-------|-------------|
| `/office-hours` | Brainstorming a new idea or feature before writing code |
| `/plan-ceo-review` | Reviewing a strategy or product plan |
| `/plan-eng-review` | Reviewing an architecture or technical plan |
| `/plan-design-review` | Reviewing a design plan |
| `/design-consultation` | Creating or evolving a design system |
| `/review` | Code review before merging |
| `/ship` | Ready to deploy / create a PR |
| `/browse` | All web browsing and page interaction |
| `/qa` | Testing a feature or verifying a deployment |
| `/qa-only` | Headless QA without side effects |
| `/design-review` | Visual design audit |
| `/setup-browser-cookies` | Configure browser session for authenticated pages |
| `/retro` | Weekly retrospective |
| `/investigate` | Debugging errors or unexpected behavior |
| `/document-release` | Post-ship documentation updates |
| `/codex` | Second opinion or adversarial code review |
| `/careful` | Working with production or live systems |
| `/freeze` | Scope edits to one module/directory |
| `/guard` | Maximum safety mode (destructive warnings + edit restrictions) |
| `/unfreeze` | Remove edit restrictions set by /freeze or /guard |
| `/gstack-upgrade` | Upgrade gstack to the latest version |
