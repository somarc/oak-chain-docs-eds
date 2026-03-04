# Documentation Classification

Which docs stay in the EDS repo vs move to Obsidian vault (exploration/understanding).

---

## Keep in oak-chain-docs-eds (site concerns)

**Purpose:** Running the site, authoring content, block usage, project setup. Tied to this repo.

| File | Why keep here |
|------|----------------|
| **AEM-CLI-SETUP.md** | How to run *this* project (`aem up`). Developer-facing for oak-chain-docs-eds. |
| **BLOCKS-REFERENCE.md** | Reference for blocks *in this site*. Authors/developers need it in-repo. |
| **CONTENT-MIGRATION-thesis.md** | Actual migrated content (thesis page). Used for paste/import; belongs with the site. |
| **CONTENT-STRUCTURE-GUIDE.md** | How to structure content *for this site* (pages, block patterns). Site-specific. |
| **FLOW-DIAGRAM-GUIDE.md** | How to use the flow-diagram block *in this site*. Block usage. |
| **GRAPH-MIGRATION-STATUS.md** | Status of which flow diagrams are ported for *this site*. Project status. |
| **OAK-CHAIN-DOCS-EDS-SUMMARY.md** | Summary of *this* project (oak-chain-docs-eds). Project overview. |
| **PROJECT-SETUP-COMPLETE.md** | Setup checklist for *this* EDS site. Project setup. |
| **QUICK-START.md** | Quick start for *this* site (blocks, aem up). Developer/author entrypoint. |
| **README-START-HERE.md** | Main entrypoint for *this* repo. Stays at repo root. |
| **THEMING-GUIDE.md** | Ethereum purple theme *for this site*. Site-specific styling. |

---

## Move to Obsidian vault (exploration / understanding)

**Purpose:** Understanding Helix/EDS/DA in general, migration strategies, DA internals. Not tied to this repo; useful across projects and for learning.

| File | Why move to vault |
|------|-------------------|
| **BLOCK-HTML-FORMAT.md** | General: how DA expects HTML block structure. Reusable for any EDS migration. |
| **BLOCK-TABLE-FORMAT.md** | General: ASCII table format for blocks (and why it didn’t work). Reference for any EDS. |
| **BLOCKS-COMPLETE-SUMMARY.md** | Broad summary of blocks + migration; more “exploration” than site-only. |
| **DA-BLOCK-SYSTEM-EXPLAINED.md** | Deep dive into DA’s aem2prose/prose2aem. Understanding DA, not site-specific. |
| **DA-BYPASS-UPLOAD-TOOL.md** | General: content flow, bypassing DA, API/Git. Strategy doc. |
| **DA-MIGRATION-SOLUTION.md** | General: correct HTML format for DA paste. Migration pattern. |
| **DA-PREVIEW-PUBLISH-AND-HELIX-ARCHITECTURE.md** | How DA triggers preview/publish and how that fits Helix. Architecture/understanding. |
| **DOCUMENTATION-UPDATE-SUMMARY.md** | Housekeeping (e.g. npm → aem up). Historical; fits vault. |
| **EDS-MIGRATION-GUIDE.md** | General EDS migration concepts. Learning/reference. |
| **HELIX-EDS-COMPLETE-REFERENCE.md** | Single reference for how Helix/EDS works. Core understanding doc. |
| **HELIX-IMPORTER-EXPLAINED.md** | How helix-importer works (no blockify). Reusable for any import. |
| **MIGRATION-NOTES-thesis.md** | Example migration notes (thesis). Pattern/learning; thesis content itself stays in CONTENT-MIGRATION-thesis.md. |

---

## Summary

- **Keep in repo (11):** AEM-CLI-SETUP, BLOCKS-REFERENCE, CONTENT-MIGRATION-thesis, CONTENT-STRUCTURE-GUIDE, FLOW-DIAGRAM-GUIDE, GRAPH-MIGRATION-STATUS, OAK-CHAIN-DOCS-EDS-SUMMARY, PROJECT-SETUP-COMPLETE, QUICK-START, README-START-HERE, THEMING-GUIDE.
- **Move to vault (12):** BLOCK-HTML-FORMAT, BLOCK-TABLE-FORMAT, BLOCKS-COMPLETE-SUMMARY, DA-BLOCK-SYSTEM-EXPLAINED, DA-BYPASS-UPLOAD-TOOL, DA-MIGRATION-SOLUTION, DA-PREVIEW-PUBLISH-AND-HELIX-ARCHITECTURE, DOCUMENTATION-UPDATE-SUMMARY, EDS-MIGRATION-GUIDE, HELIX-EDS-COMPLETE-REFERENCE, HELIX-IMPORTER-EXPLAINED, MIGRATION-NOTES-thesis.

After move: add a short note in the EDS repo (e.g. in README-START-HERE or a small EXPLORATION-DOCS.md) that exploration/understanding docs live in the Obsidian vault at `04-Resources/Helix-EDS-Exploration` (or the path you use).
