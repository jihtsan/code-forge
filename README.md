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
