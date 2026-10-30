# Oak Chain Docs live-release gate

**Status:** OPEN (2026-10-30, owner decision) · code and content  
**Applies to:** `oak-chain-docs-eds` DA content, code, generated index/sitemap state, and live route ownership  
**Decision source:** *Oak Chain × x402 Decision Memo*, Revision 3 — paid-action centering, 2026-07-18

**2026-10-30, owner decisions:** first, code changes may merge to `main` (which updates live code). Later the same day, after the docs audit, consolidation (29 to 21 pages) and the technical-manual redesign were reviewed on preview, the owner approved publishing the amended content to live, rebuilding the index and sitemap, and unpublishing the retired and orphan routes.

The x402 evidence list below no longer gates publication; it remains the bar for any page that claims paid actions over HTTP 402 are implemented. `/status` is where demonstrated versus not-yet-validated work is stated.

**Recorded drift:** on 2026-10-24 between 14:55 and 14:57 GMT, 16 pages and `/nav` were republished to live while this gate was closed (admin status `live.lastModified`). Their live content is identical to preview; the operator is unknown.

## Allowed while the gate is closed

- Change DA source through the governed local `da-cli`.
- Preview changed pages on a feature code branch (`*.aem.page`).
- Run read-only audits, freshness checks, route classification, visual review, and tests.
- Prepare code and content pull requests.

## Prohibited while the gate is closed

- `da publish`
- `da deploy`
- live query-index or sitemap rebuilds
- live route cleanup/unpublish operations
- any other operation that changes `*.aem.live`

The existing live site must remain unchanged. In particular, stale live-only routes may be classified and documented but not cleaned until this gate opens.

## x402 implementation evidence required to open the gate

The Oak Chain implementation must satisfy the decision memo rather than merely return HTTP status 402. Required evidence includes:

1. `OakActionV1`, canonical encoding, and network-independent `operationId`.
2. x402 V2 `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` handling at the HTTP action-admission boundary.
3. Exact binding between the payment quote/identifier and the normalized Oak action.
4. Durable payment/action ledger and outbox with replay-safe uniqueness constraints.
5. Independent settlement verification and an explicit inclusion/finality policy.
6. Exactly-once recovery across timeout, restart, duplicate request, and leader failover.
7. Test-cluster proof that one settled payment admits one canonical write or delete and that all validators converge.
8. An Oak receipt correlating settlement evidence, `operationId`, consensus state, and durable Oak head.
9. Reconciliation/refund or credit behavior for paid actions that cannot be fulfilled.
10. A reviewed production settlement profile and bounded canary/rollback plan.

## Final release checks after x402 implementation

- Reconcile DA copy with the verified implementation and remove temporary “not deployed” or “reference path” wording only where evidence permits.
- Run full feature-branch page, block, metadata, accessibility, link, freshness, sitemap, index, and route-ownership audits.
- Review the feature preview visually.
- Obtain explicit human approval for live publication and orphan-route cleanup.

No item in this file authorizes live publication by itself.
