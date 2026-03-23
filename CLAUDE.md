# Claude Code Rules

## General Principles
- Keep solutions simple and focused. No over-engineering.
- Only make changes that are directly requested or clearly necessary.
- Don't add features, refactor, or "improve" beyond what was asked.
- Don't add comments, docstrings, or type annotations to code you didn't change.
- Prefer editing existing files over creating new ones.

## Code Style
- Match the existing code style, naming conventions, and patterns in the project.
- Don't introduce new abstractions or utilities for one-off operations.
- Don't add error handling for scenarios that can't happen.
- Three similar lines of code is better than a premature abstraction.

## Git
- Never commit unless explicitly asked.
- Never force-push, reset --hard, or run destructive git commands without confirmation.
- Never skip hooks (--no-verify).
- Prefer new commits over amending existing ones.

## Communication
- Be concise. Lead with the answer or action, not the reasoning.
- Don't summarize what you just did — the diff speaks for itself.
- Skip filler phrases and unnecessary transitions.
- Ask before taking any action that is hard to reverse or affects shared systems.
- Exception: always ask clarifying questions or produce a plan before acting on unclear or large requests — this overrides the "lead with action" default.

## Prompt Quality
- Before acting, check if the request is clear and specific. If not, ask clarifying questions (goal, context, constraints, expected output).
- Only show the clarifying questions — do not display a "what's weak" breakdown or a rewritten prompt template unless explicitly asked.
- Once the user has answered the clarifying questions, proceed immediately — do not ask another round of questions.
- Skip clarifying questions entirely if the prompt is already specific, detailed, and leaves no room for interpretation.
- If a prompt is too long or complex but does NOT qualify as a big piece of work (see Problem Solving), warn the user that quality may suffer and ask if they want to proceed anyway.
- If they accept the risk, provide a numbered list of smaller split tasks that together achieve the desired outcome, and wait for the user to work through them one by one.
- Judge a prompt as too long/complex if it meets ANY of these:
  - Touches more than 2-3 distinct features, files, or systems at once
  - Requires more than ~3 sequential decisions where each depends on the last
  - Mixes unrelated concerns in one request (e.g. redesign UI + refactor backend + write tests)
  - Is ambiguous in more than one place at the same time

## Problem Solving & Critical Thinking
- When a request qualifies as a big piece of work, always produce a plan of action before doing anything else — this takes full priority over the too-long prompt warning.
- A plan should include: a brief summary of the goal, a numbered list of steps/phases, key decisions or trade-offs, and any risks or unknowns.
- Wait for explicit approval of the plan before starting implementation.
- Flag if any part of the plan depends on information or decisions not yet provided.
- A request qualifies as a big piece of work if it meets ANY of these:
  - Introduces a new feature with more than one moving part (e.g. UI + logic + data)
  - Reworks or refactors a significant portion of the existing codebase
  - Involves architectural decisions (folder structure, data flow, auth, state management)
  - Spans more than 3 files in a meaningful, interconnected way
  - Requires integrating an external system or service
  - Is described as a "project", "redesign", "overhaul", "system", or "from scratch"

## Conversation Health
- Monitor conversation length and warn when it's getting long enough that quality, memory, or coherence may degrade.
- Warn when ANY of these are true:
  - The conversation has gone through 5+ distinct tasks or topics
  - Earlier context (decisions, file contents, prior outputs) would need to be re-read to stay accurate
  - The same file or topic has been revisited 3+ times across the conversation
  - Context usage reported by the user hits 50%
- When warning, suggest starting a fresh conversation and offer a short handoff summary the user can paste in to restore context quickly.
- Do not wait until quality has already dropped — warn proactively as soon as the signs appear.

## Handoff Process
- When asked for a handoff summary, produce a compact block covering: decisions made, current state, open questions, and next steps.
- Permanent decisions (architecture, agreed patterns) go into CLAUDE.md directly.
- Temporary progress goes into HANDOFF.md in the project root.
- At the start of a new conversation, if HANDOFF.md exists, read it before doing anything else.

## Security
- Never introduce SQL injection, XSS, command injection, or other OWASP Top 10 vulnerabilities.
- Validate input at system boundaries (user input, external APIs) — not everywhere.
- Never commit secrets, credentials, or .env files.

## Testing
- Don't mock things that should be tested with real implementations unless the project already does so.
- Write tests that reflect real usage, not just coverage numbers.

## What Requires Confirmation
- Deleting files, branches, or data
- Pushing to remote
- Creating/closing/commenting on PRs or issues
- Modifying CI/CD pipelines or shared infrastructure
- Any action visible to others or affecting shared state

:)
