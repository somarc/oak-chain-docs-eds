# AEM CLI Setup for Oak Chain Docs EDS

Quick reference for using the AEM CLI with this project.

## Installation

The AEM CLI is required for local development.

### Install AEM CLI

```bash
npm install -g @adobe/aem-cli
```

### Verify Installation

```bash
aem --version
```

## Local Development

### Start Local Server

```bash
cd oak-chain-docs-eds
aem up
```

This will:
- Start local development server
- Serve site at `http://localhost:3000`
- Watch for file changes
- Auto-reload on changes

### Stop Server

```bash
# Press Ctrl+C in the terminal running aem up
```

Or:

```bash
aem down
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `aem up` | Start local dev server |
| `aem down` | Stop local dev server |
| `aem --version` | Show CLI version |
| `aem --help` | Show all commands |

## Local Development Workflow

1. **Start server:**
   ```bash
   aem up
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Edit files:**
   - Blocks: `blocks/*/`
   - Styles: `styles/`
   - Scripts: `scripts/`
   - Content: Create `.md` files

4. **View changes:**
   - Browser auto-reloads on file changes
   - No manual refresh needed

5. **Stop server:**
   - Press `Ctrl+C`

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process (macOS/Linux)
kill -9 $(lsof -ti:3000)

# Then restart
aem up
```

### Command Not Found

If `aem` command is not found:

```bash
# Install AEM CLI globally
npm install -g @adobe/aem-cli

# Verify installation
which aem
aem --version
```

### Server Won't Start

1. Check you're in the correct directory:
   ```bash
   pwd
   # Should be: /Users/mhess/aem/aem-code/OAK/oak-chain-docs-eds
   ```

2. Check for `.hlx` directory (EDS project marker)
   ```bash
   ls -la
   # Should see .hlx/ folder
   ```

3. Try cleaning and restarting:
   ```bash
   rm -rf .hlx
   aem up
   ```

## Development URLs

When `aem up` is running:

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Main site |
| `http://localhost:3000/tools/sidekick/` | Sidekick UI |
| `http://localhost:3000/[page].plain.html` | Raw HTML output |

## Block Development

When developing blocks:

1. **Start server:**
   ```bash
   aem up
   ```

2. **Edit block files:**
   ```
   blocks/my-block/my-block.css
   blocks/my-block/my-block.js
   ```

3. **Create test page:**
   ```markdown
   # Test Page
   
   | My Block |
   |----------|
   | Content  |
   ```

4. **View in browser:**
   ```
   http://localhost:3000/test-page
   ```

5. **Inspect:**
   - Open browser DevTools
   - Check Console for errors
   - Check Network for asset loading
   - Use Elements tab to inspect HTML

## Comparing Local vs Production

**Local (Development):**
```bash
aem up
http://localhost:3000/thesis
```

**Preview (Adobe):**
```
https://main--oak-chain-docs-eds--somarc.aem.page/thesis
```

**Production (Adobe):**
```
https://main--oak-chain-docs-eds--somarc.aem.live/thesis
```

## Tips

### Fast Iteration

- Keep `aem up` running in a dedicated terminal
- Edit files in your IDE
- Changes appear immediately in browser
- No restart needed

### Multiple Projects

If working on both EDS projects:

**Terminal 1:**
```bash
cd oak-chain-docs-eds
aem up
# Runs at http://localhost:3000
```

**Terminal 2:**
```bash
cd blockchain-aem-eds
aem up --port 3001
# Runs at http://localhost:3001
```

### Debugging

1. **Check server logs** in terminal running `aem up`
2. **Open browser DevTools** (F12)
3. **Check Console** for JavaScript errors
4. **Check Network** for failed requests
5. **Use Elements** to inspect rendered HTML

## References

- **AEM CLI Docs:** https://github.com/adobe/helix-cli
- **EDS Docs:** https://www.aem.live/docs/
- **Project Docs:** See README-START-HERE.md

---

**Quick Start:** Run `aem up` and visit `http://localhost:3000` 🚀
