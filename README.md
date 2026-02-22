# majestic-build-tools

## Purpose

Heavy media operations for Majestic. FFmpeg wrappers, adaptive build pipeline, artifact cache management, probe utilities, and cleanup of transient files. This is compute machinery, not application logic.

## Responsibilities

- **FFmpeg wrappers**: Encapsulate ffmpeg/ffprobe invocations
- **Adaptive build pipeline**: Produce playback artifacts (remux, transcode) for target devices
- **Artifact cache management**: Store, index, and evict build outputs
- **Probe utilities**: Extract container/codec metadata from media files
- **Cleanup of transient files**: Remove partial or failed build artifacts

## Non-Responsibilities

- **HTTP routing**: No request handling; invoked by majestic-server
- **DB schema**: No database; server owns registry
- **UI**: No user interface
- **Identity logic**: No edition hash or fingerprint computation; uses majestic-identity-contract for identity inputs only

## Architectural Principles

1. **Deterministic output artifacts**: Same input, same build config, same output
2. **Locking**: Prevent double builds; single writer per artifact
3. **Clean cancellation**: Abort leaves no orphan files; cleanup on cancel
4. **Compute isolation**: Build tools are stateless with respect to identity; server provides paths and config

## Critical Invariants

- Build output is deterministic for given input and config
- Concurrent build attempts for same artifact are serialized
- Abort/cancel must not leave partial artifacts that could be served
- No HTTP, no DB, no UI

## Dependencies

- **majestic-identity-contract**: For identity inputs when needed (e.g. artifact naming)
- **majestic-server**: Invokes build tools; provides paths and policy

## Failure Philosophy

- Build failure: mark artifact failed; do not serve partial output
- Lock contention: wait or fail; never overwrite in-flight build
- Cleanup on abort: remove partial files; update cache state

## Current Status

Build pipeline. Artifact cache. Probe utilities. Invoked by majestic-server.

## Future Constraints

- Transcoding logic stays here; never in streaming path
- No identity mutation; identity is server-owned
- Determinism and locking are non-negotiable
