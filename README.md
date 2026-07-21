# Oak Chain Docs (EDS)

Canonical public documentation for **Oak Chain** — content provenance infrastructure built on Apache Jackrabbit Oak, Aeron Cluster, Ethereum settlement, and Adobe Edge Delivery Services.

## Disposition

This repository owns the public EDS experience and its presentation code. **DA is the single source of truth for authored site content and navigation.** Do not keep content fixtures in Git and do not call DA or AEM admin APIs from repository scripts.

Technical implementation authority remains with the repository that owns each concern:

- Validator runtime and consensus: `../jackrabbit-oak/oak-segment-consensus/`
- Payment and settlement contracts: `../oak-chain-smart-contracts/`
- AEM integration: `../oak-chain-connector/`
- Edge adapter and upstream operations API: `../oak-chain-edge-worker/`
- Client ergonomics: `../oak-chain-sdk/`
- Cross-repository program decisions: `../Blockchain-AEM/` and `../blockchain-aem-program-spine/`

When public copy and implementation disagree, reconcile the DA content to the owning implementation or explicitly label the copy as proposed, experimental, or target-state architecture.

## Environments

- Preview: https://main--oak-chain-docs-eds--somarc.aem.page/
- Live: https://main--oak-chain-docs-eds--somarc.aem.live/

Feature preview URLs use the normalized feature branch name:

```text
https://{branch}--oak-chain-docs-eds--somarc.aem.page/
```

## Authoring and delivery

Content is authored in DA at https://da.live/#/somarc/oak-chain-docs-eds.

All content, preview, publish, route, index, sitemap, and audit operations must use the governed local CLI:

```bash
DA="node /Users/mhess/aem/aem-code/da/da-cli/bin/da.js"

$DA --org somarc --repo oak-chain-docs-eds --format json status
$DA --org somarc --repo oak-chain-docs-eds --format json content tree / --ext html
$DA --org somarc --repo oak-chain-docs-eds --format json site freshness / --include-shared
$DA --org somarc --repo oak-chain-docs-eds --format json audit contracts --prefix / --verify-code
```

Remote writes are dry-run by default. Review diffs before using root `--commit`; preview and live publication are separate human-reviewed steps.

## Current live-release gate

DA source corrections and feature previews are permitted, but live publication is currently locked. See [RELEASE-GATE.md](./RELEASE-GATE.md). The gate remains closed until the Oak Chain x402 implementation defined by the **Oak Chain × x402 Decision Memo, Revision 3 (2026-07-18)** is implemented and verified.

## Local development

```bash
npm install
node /Users/mhess/aem/aem-code/da/da-cli/bin/da.js up
```

The local site runs at http://localhost:3000.

## Quality gates

```bash
npm test
npm run lint
```

Before release, also run the local CLI freshness, sitemap, route-ownership, block-contract, and page audits against the intended branch.

## License

Apache 2.0
