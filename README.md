# Oak Chain Docs (EDS)

Public documentation site for **Oak Chain** — a distributed content repository bridging Ethereum and Apache Jackrabbit Oak. Built on Adobe Edge Delivery Services.

This is the canonical public site, replacing the VitePress build at `oak-chain-docs/`.
Internal engineering docs continue to live in `Blockchain-AEM/implementation/`.

## Environments

- Preview: https://main--oak-chain-docs-eds--somarc.aem.page/
- Live: https://main--oak-chain-docs-eds--somarc.aem.live/

## Authoring

Content is authored in DA (Document Authoring): https://da.live/#/somarc/oak-chain-docs-eds

## Local development

```bash
npm install
aem up
```

Site runs at http://localhost:3000.

## Lint

```bash
npm run lint
npm run lint:fix
```

## Project sources

- **Design source of truth:** `../oak-chain-docs/` (VitePress) — being retired
- **Internal engineering docs:** `../Blockchain-AEM/implementation/`
- **Validator runtime:** `../jackrabbit-oak/oak-segment-consensus/`

## License

Apache 2.0
