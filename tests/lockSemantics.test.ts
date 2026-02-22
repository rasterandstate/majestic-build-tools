/**
 * Lock semantics tests.
 * Asserts lock key format and cancellation cleanup behavior.
 */

import { describe, it, expect } from 'vitest';
import {
	lockKey,
	LOCK_ACQUISITION,
	LOCK_RELEASE,
	CANCELLATION_LOCK_CLEANUP
} from '../src/lockPolicy.js';

describe('lockSemantics', () => {
	it('lockKey produces deterministic key for (mediaFileId, kind)', () => {
		expect(lockKey(1, 'remux_fmp4_appletv')).toBe('1:remux_fmp4_appletv');
		expect(lockKey(42, 'transcode_fmp4_appletv')).toBe('42:transcode_fmp4_appletv');
	});

	it('lockKey different mediaFileId produces different key', () => {
		expect(lockKey(1, 'remux')).not.toBe(lockKey(2, 'remux'));
	});

	it('lockKey different kind produces different key', () => {
		expect(lockKey(1, 'remux')).not.toBe(lockKey(1, 'transcode'));
	});

	it('LOCK_ACQUISITION enforces single writer', () => {
		expect(LOCK_ACQUISITION.SINGLE_WRITER).toBe(true);
		expect(LOCK_ACQUISITION.KEY_FORMAT).toBe('mediaFileId:kind');
	});

	it('LOCK_RELEASE required on success, failure, cancel', () => {
		expect(LOCK_RELEASE.ON_SUCCESS).toBe(true);
		expect(LOCK_RELEASE.ON_FAILURE).toBe(true);
		expect(LOCK_RELEASE.ON_CANCEL).toBe(true);
	});

	it('CANCELLATION_LOCK_CLEANUP specifies abort first, fallback kill by PID', () => {
		expect(CANCELLATION_LOCK_CLEANUP.ABORT_CONTROLLER_FIRST).toBe(true);
		expect(CANCELLATION_LOCK_CLEANUP.FALLBACK_KILL_BY_PID).toBe(true);
		expect(CANCELLATION_LOCK_CLEANUP.MARK_ARTIFACT_FAILED).toBe(true);
		expect(CANCELLATION_LOCK_CLEANUP.RELEASE_LOCK).toBe(true);
	});
});
