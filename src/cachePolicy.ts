/**
 * Cache semantics for artifact storage and reuse.
 *
 * Cache semantics are part of the public contract.
 * Backend implementations must respect these rules.
 */

import { ARTIFACT_FORMAT_VERSION } from './artifactSpec.js';

/** Cache key components. Key = formatVersion + fingerprint + kind + optional track index. */
export interface CacheKeyInput {
	/** size:headHash:tailHash from identity fingerprint. */
	fingerprintSize: number;
	fingerprintHeadHash: string;
	fingerprintTailHash: string;
	/** Artifact kind (remux_fmp4_appletv, etc.). */
	kind: string;
	/** Audio track index when multi-track. Omit or 0 for primary. */
	audioTrackIndex?: number;
}

/**
 * Build cache key string for artifact lookup.
 * Format: v{ARTIFACT_FORMAT_VERSION}:{size}:{head}:{tail}{trackSuffix}
 * Track suffix: :a{N} when audioTrackIndex > 0, else empty.
 *
 * ARTIFACT_FORMAT_VERSION is included so that format bumps invalidate cache reuse.
 */
export function buildCacheKey(input: CacheKeyInput): string {
	const { fingerprintSize, fingerprintHeadHash, fingerprintTailHash, audioTrackIndex } = input;
	const track = audioTrackIndex != null && audioTrackIndex > 0 ? `:a${audioTrackIndex}` : '';
	return `v${ARTIFACT_FORMAT_VERSION}:${fingerprintSize}:${fingerprintHeadHash}:${fingerprintTailHash}${track}`;
}

/**
 * Artifact reuse conditions:
 * - status = 'ready'
 * - source_fingerprint matches current source (cache key)
 * - File exists on disk
 * If fingerprint mismatch: remove stale artifact before rebuild.
 */
export const ARTIFACT_REUSE_CONDITIONS = {
	STATUS_READY: 'ready',
	FINGERPRINT_MUST_MATCH: true,
	FILE_MUST_EXIST: true
} as const;

/**
 * Eviction policy:
 * - LRU by last_accessed_at (fallback: created_at)
 * - Safety window: do not evict artifacts accessed within last 5 minutes
 * - Evict oldest first when over size limit
 */
export const EVICTION_SAFETY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Cancellation cleanup behavior:
 * - On abort: remove partial temp file
 * - Mark artifact status = 'failed' with error message
 * - Release build lock
 * - Do not leave orphan files that could be served
 */
export const CANCELLATION_CLEANUP = {
	REMOVE_PARTIAL: true,
	MARK_FAILED: true,
	RELEASE_LOCK: true
} as const;
