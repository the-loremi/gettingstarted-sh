# Launch Playbook

> Operational checklist for launching gettingstarted.sh. Strategy and draft content are in `inspo/strategy/growth-and-launch.md` — this is the actionable checklist.

## Pre-Launch Checklist

### Registry & Content
- [ ] 20+ tools seeded with complete YAML manifests
- [ ] All manifests pass validation (valid YAML, required fields, valid categories)
- [ ] Each seeded tool tested on at least one OS

### Infrastructure
- [ ] `curl gettingstarted.sh/[tool] | sh` working on macOS
- [ ] `curl gettingstarted.sh/[tool] | sh` working on Linux
- [ ] `irm gettingstarted.sh/[tool] | iex` working on Windows PowerShell
- [ ] Site deployed and accessible at gettingstarted.sh
- [ ] DNS configured and propagated

### Documentation
- [ ] README.md polished and beginner-friendly
- [ ] CONTRIBUTING.md live and tested end-to-end (someone followed it)
- [ ] LICENSE (MIT) in repo root
- [ ] CODE_OF_CONDUCT.md in repo root
- [ ] All links in README verified working

### GitHub Setup
- [ ] GitHub org `gettingstarted-sh` created
- [ ] Repo transferred or created under org
- [ ] Repo set to public
- [ ] GitHub org profile README configured
- [ ] og:image social preview set in repo settings
- [ ] Issue templates created (bug report, tool request, new tool submission)
- [ ] "Good first issue" labels created
- [ ] Branch protection rules on `main`

---

## Launch Day Checklist

- [ ] Submit to ProductHunt (see draft in `growth-and-launch.md`)
- [ ] Post Show HN (see draft in `growth-and-launch.md`)
- [ ] Publish Twitter/X thread (see draft in `growth-and-launch.md`)
- [ ] Post to Reddit communities (see drafts in `growth-and-launch.md`)
  - [ ] r/LocalLLaMA
  - [ ] r/ChatGPT
  - [ ] r/vibecoding
  - [ ] r/commandline
  - [ ] r/devtools
- [ ] Send DMs to developer friends and personal network
- [ ] Monitor GitHub — respond to issues/PRs within 2 hours on launch day

---

## Post-Launch: Weeks 1-4

- [ ] Respond to every GitHub issue within 24 hours
- [ ] Merge first external contributor PRs quickly
- [ ] Publicly thank each contributor (GitHub comment + Twitter mention)
- [ ] Send verification outreach emails to 5 tool creators (see template below)
- [ ] Write and publish blog post: "Why we built gettingstarted.sh"
- [ ] Track metrics weekly: stars, forks, PRs, contributors

---

## Tool Creator Outreach Template

Use this email template when reaching out to tool creators to verify their registry listing:

**Subject:** Your tool is listed on gettingstarted.sh — want to verify it?

**Body:**

Hi [Name/Team],

I'm Barnabas from The Loremi Ltd. We built gettingstarted.sh, an open-source setup registry for AI tools. Users can install any listed tool with one command:

```
curl gettingstarted.sh/[your-tool] | sh
```

[Your tool name] is already in the registry with install methods for [brew/winget/npm/etc.]. We'd love for you to verify the listing — this means checking that our install commands and version info are correct.

Verified tools get a badge on the registry and higher placement in search results.

You can review the listing here: https://gettingstarted.sh/[your-tool]

If anything needs updating, you're welcome to submit a PR or just reply to this email with corrections.

Thanks for building great tools,
Barnabas Oretan
The Loremi Ltd
https://gettingstarted.sh

---

## Ongoing Cadence

### Weekly
- Triage new GitHub issues
- Review and merge PRs
- Update metrics tracking (stars, forks, PRs, contributors)

### Monthly
- Publish changelog (what tools were added, what changed)
- Spotlight a contributor (GitHub profile, what they contributed, thank them publicly)
- Ensure 5+ "good first issue" items are open for newcomers
- Review and update seeded tool versions if outdated

### Quarterly
- Review roadmap progress against milestones
- Adjust targets based on actual traction
- Evaluate partnership opportunities with tool creators
- Assess readiness for next phase
