# Code Forge

Code Forge is a workspace for building interfaces with Codex and Google Stitch.

## Stitch integration

This project uses two complementary layers:

- **Agent Skills** provide the design and build workflows used by the coding agent.
- **Stitch MCP** provides the remote tools for projects, screens, generation, and design systems.

The project enables these Codex marketplace plugins in `.codex/config.toml`:

- `stitch-design`
- `stitch-build`
- `stitch-utilities`

The plugin packages are installed in Codex's local cache, not copied into this
repository. On a new machine, register the upstream marketplace and install the
three plugins once:

```bash
codex plugin marketplace add google-labs-code/stitch-skills --ref main \
  --sparse .agents/plugins \
  --sparse plugins/stitch-design \
  --sparse plugins/stitch-build \
  --sparse plugins/stitch-utilities
codex plugin add stitch-design@stitch-skills
codex plugin add stitch-build@stitch-skills
codex plugin add stitch-utilities@stitch-skills
```

The remote MCP server is configured as `stitch` in this project's `.codex/config.toml`.
It remains disabled until a Stitch API key is supplied through the `STITCH_API_KEY`
environment variable. After setting the variable, enable the server in the project
config and restart Codex:

```toml
[mcp_servers.stitch]
url = "https://stitch.googleapis.com/mcp"
env_http_headers = { "X-Goog-Api-Key" = "STITCH_API_KEY" }
enabled = true
```

The project config is intentionally separate from `~/.codex/config.toml`, so Stitch
plugins and tools are not enabled in unrelated repositories. Skill instructions are
loaded progressively; the MCP tool catalog is available only in sessions where this
server is enabled, and Stitch data enters the context only when a tool is called.

Reading a Skill does not dynamically enable a disabled MCP server. Set `enabled = true`
in this project's config after exporting `STITCH_API_KEY`, then restart the Codex
session. The tool definitions remain available for that session, but the remote
server is not running in other projects or sessions where it is disabled.

Never commit the API key or place it in client-side source code.

## References

- [Stitch Agent Skills](https://stitch.withgoogle.com/docs/skills/get-started/)
- [Stitch MCP setup](https://stitch.withgoogle.com/docs/mcp/setup/)
- [Stitch Skills repository](https://github.com/google-labs-code/stitch-skills)

## Run the code-forge implementation

This is a Vite application and must be served over HTTP; opening `index.html`
directly with a `file://` URL does not load the TypeScript module graph.

```bash
npm install
npm run dev
```

Then open <http://127.0.0.1:4173/>. The encoding workbench is available at
<http://127.0.0.1:4173/engine>.

## Deploy to Cloudflare Workers

The application is deployed as Cloudflare Workers Static Assets. Authenticate
the Wrangler CLI once, then deploy the production build:

```bash
npx wrangler login
npm run deploy
```

To test the Worker routing locally, including direct navigation to `/engine`,
run:

```bash
npm run cf:dev
```

The custom `www` hostname is configured as a Cloudflare Worker custom domain.
Its zone must already be active in the same Cloudflare account used by Wrangler.

Batch mode accepts UTF-8 CSV files up to 2 MB. It reads a column named `data`,
`value`, `barcode`, `code`, or the corresponding Chinese label; when no known
header is present, it uses the first column. A batch is limited to 50 items and
valid results can be downloaded together as a ZIP of SVG files.

## Label printing

On the generator page, use **打印标签** or **Command+P / Ctrl+P** while the page
has focus. The dialog supports the current barcode or all valid items in the
generated batch, label width/height in millimeters, uniform margins and copies
per barcode. Invalid batch items are explicitly counted and skipped. Modified
batch inputs must be regenerated to replace the existing batch.

Presets are 60 × 40, 50 × 30, 40 × 30 and 100 × 150 mm. Custom labels accept
widths of 20–210 mm and heights of 15–297 mm, with at least 10 × 10 mm of content
area after margins. Each barcode can have 1–100 copies; a job is capped at 500
labels. These are application limits, not a guarantee that a printer accepts
every paper size. Settings last for the current page session.

Each label is a separate printed page with monochrome SVG artwork, including
the encoded two-digit ISSN supplement. Artwork fits proportionally within the
label while retaining its quiet zones. The print stylesheet isolates labels
from the site, including when using the browser's Print menu. Invalid settings
produce an explanatory page instead of printing unrelated site content.

In the system/browser print dialog:

- Select a printer already configured in Windows or macOS, and select the same
  paper dimensions as in the label dialog.
- Use 100% / actual size, disable headers and footers, and leave system copies
  at **1** because the application already expands each barcode's copies.
- Configure gap/black-mark sensing and media calibration in the printer driver.
- Print one test label and verify physical dimensions and barcode scanning
  before running a batch, particularly for long data or small labels.

This version uses standard browser printing. It cannot enumerate printers,
scan a LAN, select a printer silently or confirm that paper was printed.
Cross-platform printer compatibility depends on the OS, browser, driver and
specific device; no physical model is certified yet. If a device is unavailable,
add it in system settings or export SVG/PNG for the manufacturer's software.
Local print helpers and printer languages such as ZPL/TSPL remain future work.

The dialog's **申请适配 / 报告打印问题** section collects model, OS/version,
connection, system-printing availability, optional DPI and a description. It
prepares a GitHub issue link; the user must log in and submit the public issue
themselves. Nothing is automatically posted or stored in a backend. Do not
include private barcode payloads or other sensitive data in feedback.

If **继续系统打印** does not open a printer selection window, the page now keeps
the dialog open with persistent guidance. Embedded browsers may expose
`window.print()` but silently ignore it; a successful function return is not
treated as proof that a print window opened or that paper was printed. The
request runs directly in the click handler to retain user activation.

Use **复制页面地址** to open the page in full Chrome, Edge or Safari (the address
does not transfer the current barcode/settings). To preserve the job, use
**下载打印文件** instead: `code-forge-labels.html` contains the selected labels,
expanded copies and millimeter page settings, and works offline without the
application server. Open it in a full browser and click its print button or use
the browser's Print menu. It does not print automatically on opening.

Validation for printing includes `npm test` (artwork, input boundaries, job
limits and shortcut recognition), `npm run build`, and browser checks of the
dialog, dark/mobile layouts, batch counts, print-only output and physical page
dimensions. Actual device output still requires Windows/macOS printer testing.
