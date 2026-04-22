# Accounts & Services Checklist

> External services needed for gettingstarted.sh, organized by when they're needed.

## Needed Now (Phase 0)

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| GitHub | Org `gettingstarted-sh`, public repo, Actions for CI | Free | Create org, transfer or create repo |
| Domain registrar | `gettingstarted.sh` (.sh is the Saint Helena TLD) | ~$30/yr | Register via Namecheap, Gandi, or Cloudflare Registrar |

## Needed for Phase 1

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| Cloudflare | Pages (static hosting), Workers (curl/irm handler), R2 (script storage) | Free tier | Create account, set up Pages project, configure DNS |
| Supabase | PostgreSQL database for CMS data | Free tier | Create project, configure connection string |
| Loremi CMS | Tenant `gettingstarted` for tool/script/docs content types | Internal | Set up tenant after CMS core is live |

## Needed for Phase 2+

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| Analytics | Page views, command usage tracking | Free–$9/mo | Plausible ($9/mo) or Cloudflare Web Analytics (free) |
| Vercel | Backup hosting option if Cloudflare doesn't work out | Free tier | Only if needed |
