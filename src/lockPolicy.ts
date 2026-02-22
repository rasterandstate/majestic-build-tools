/**
 * Lock semantics for artifact builds.
 *
 * Lock semantics must remain stable across backends.
 * Backend implementations must respect these rules.
 * Prevents duplicate builds for same (media_file_id, kind).
 */

/** Lock key: media_file_id:kind */
export function lockKey(mediaFileId: number, kind: string): string {
	return `${mediaFileId}:${kind}`;
}

/**
 * Lock acquisition behavior:
 * - tryAcquire returns true if lock acquired, false if another build in progress
 * - Single writer per (media_file_id, kind)
 * - Caller must call releaseBuildLock when build finishes (success or failure)
 */
export const LOCK_ACQUISITION = {
	SINGLE_WRITER: true,
	KEY_FORMAT: 'mediaFileId:kind'
} as const;

/**
 * Lock release behavior:
 * - Must be called on build completion (success or failure)
 * - Must be called on cancellation
 * - Clears in-memory lock and abort controller
 */
export const LOCK_RELEASE = {
	ON_SUCCESS: true,
	ON_FAILURE: true,
	ON_CANCEL: true
} as const;

/**
 * Cancellation cleanup behavior:
 * - Abort in-memory controller if registered
 * - If process restarted: kill by PID from persistent store
 * - Mark artifact failed
 * - Release lock
 */
export const CANCELLATION_LOCK_CLEANUP = {
	ABORT_CONTROLLER_FIRST: true,
	FALLBACK_KILL_BY_PID: true,
	MARK_ARTIFACT_FAILED: true,
	RELEASE_LOCK: true
} as const;
