# Code Forge

Code Forge is a workspace for building interfaces with Codex and Google Stitch.

## Stitch integration

This project uses two complementary layers:

- **Agent Skills** provide the design and build workflows used by the coding agent.
- **Stitch MCP** provides the remote tools for projects, screens, generation, and design systems.

The Codex marketplace plugins are:

- `stitch-design`
- `stitch-build`
- `stitch-utilities`

The remote MCP server is configured as `stitch` in Codex. It remains disabled until a
Stitch API key is supplied through the `STITCH_API_KEY` environment variable. After
setting the variable, enable the server in `~/.codex/config.toml`:

```toml
[mcp_servers.stitch]
url = "https://stitch.googleapis.com/mcp"
env_http_headers = { "X-Goog-Api-Key" = "STITCH_API_KEY" }
enabled = true
```

Never commit the API key or place it in client-side source code.

## References

- [Stitch Agent Skills](https://stitch.withgoogle.com/docs/skills/get-started/)
- [Stitch MCP setup](https://stitch.withgoogle.com/docs/mcp/setup/)
- [Stitch Skills repository](https://github.com/google-labs-code/stitch-skills)
