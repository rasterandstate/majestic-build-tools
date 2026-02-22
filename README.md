# majestic-build-tools

Canonical, deterministic build pipeline for Majestic. Defines adaptive build logic, artifact generation rules, cache semantics, lock semantics, and the backend execution interface.

## Purpose

Heavy media operations for Majestic. FFmpeg wrappers, adaptive build pipeline, artifact cache management, probe utilities, and cleanup of transient files. This is compute machinery, not application logic.

## Responsibilities

- **FFmpeg wrappers**: Encapsulate ffmpeg/ffprobe invocations
- **Adaptive build pipeline**: Produce playback artifacts (remux, transcode) for target devices
- **Artifact cache management**: Store, index, and evict build outputs
- **Probe utilities**: Extract container/codec metadata from media files
- **Cleanup of transient files**: Remove partial or failed build artifacts

## Non-Responsibilities

This repository does NOT:

- Perform streaming
- Modify identity
- Perform transcoding policy decisions
- Implement licensing
- Depend on accelerator

## Determinism Guarantees

- Same input + same target profile = identical artifact layout.
- Artifact format is stable across minor releases.
- Backend implementations must not alter output semantics.

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

## Versioning Rules

- Breaking artifact changes require `ARTIFACT_FORMAT_VERSION` bump.
- Cache key incorporates format version; bumps invalidate cache reuse.
- Target profile semantics changes require format version bump.
- Backend interface changes require minor or major version bump.

## Structure

```
src/
  buildBackend.ts   # Backend execution interface
  adaptivePipeline.ts
  artifactSpec.ts   # Artifact format, version, container, track rules
  cachePolicy.ts    # Cache key rules, reuse conditions, eviction
  lockPolicy.ts     # Lock acquisition, release, cancellation cleanup
  probe.ts          # Probe result types
  index.ts
tests/
  artifactParity.test.ts
  cacheSemantics.test.ts
  lockSemantics.test.ts
```

## Failure Philosophy

- Build failure: mark artifact failed; do not serve partial output
- Lock contention: wait or fail; never overwrite in-flight build
- Cleanup on abort: remove partial files; update cache state

## Development

```bash
pnpm install
pnpm run check   # tsc --noEmit
pnpm test
```
