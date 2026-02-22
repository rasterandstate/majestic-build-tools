/**
 * Cache semantics tests.
 * Asserts cache key rules and reuse conditions.
 */

import { describe, it, expect } from 'vitest';
import {
	buildCacheKey,
	ARTIFACT_REUSE_CONDITIONS,
	EVICTION_SAFETY_WINDOW_MS,
	CANCELLATION_CLEANUP
} from '../src/cachePolicy.js';

describe('cacheSemantics', () => {
	it('buildCacheKey produces deterministic key for same input', () => {
		const input = {
			fingerprintSize: 12345,
			fingerprintHeadHash: 'abc123',
			fingerprintTailHash: 'def456',
			kind: 'remux_fmp4_appletv'
		};
		const key1 = buildCacheKey(input);
		const key2 = buildCacheKey(input);
		expect(key1).toBe(key2);
		expect(key1).toMatch(/^v\d+:12345:abc123:def456$/);
	});

	it('buildCacheKey includes track suffix when audioTrackIndex > 0', () => {
		const input = {
			fingerprintSize: 100,
			fingerprintHeadHash: 'aa',
			fingerprintTailHash: 'bb',
			kind: 'remux_fmp4_appletv',
			audioTrackIndex: 2
		};
		const key = buildCacheKey(input);
		expect(key).toMatch(/^v\d+:100:aa:bb:a2$/);
	});

	it('buildCacheKey omits track suffix when audioTrackIndex is 0', () => {
		const input = {
			fingerprintSize: 100,
			fingerprintHeadHash: 'aa',
			fingerprintTailHash: 'bb',
			kind: 'remux_fmp4_appletv',
			audioTrackIndex: 0
		};
		const key = buildCacheKey(input);
		expect(key).toMatch(/^v\d+:100:aa:bb$/);
	});

	it('different fingerprints produce different keys', () => {
		const key1 = buildCacheKey({
			fingerprintSize: 1,
			fingerprintHeadHash: 'a',
			fingerprintTailHash: 'b',
			kind: 'remux'
		});
		const key2 = buildCacheKey({
			fingerprintSize: 1,
			fingerprintHeadHash: 'x',
			fingerprintTailHash: 'y',
			kind: 'remux'
		});
		expect(key1).not.toBe(key2);
	});

	it('buildCacheKey includes ARTIFACT_FORMAT_VERSION (format bump invalidates cache)', () => {
		const input = {
			fingerprintSize: 1,
			fingerprintHeadHash: 'a',
			fingerprintTailHash: 'b',
			kind: 'remux'
		};
		const key = buildCacheKey(input);
		expect(key).toMatch(/^v1:/);
	});

	it('ARTIFACT_REUSE_CONDITIONS requires status ready', () => {
		expect(ARTIFACT_REUSE_CONDITIONS.STATUS_READY).toBe('ready');
		expect(ARTIFACT_REUSE_CONDITIONS.FINGERPRINT_MUST_MATCH).toBe(true);
		expect(ARTIFACT_REUSE_CONDITIONS.FILE_MUST_EXIST).toBe(true);
	});

	it('EVICTION_SAFETY_WINDOW_MS is 5 minutes', () => {
		expect(EVICTION_SAFETY_WINDOW_MS).toBe(5 * 60 * 1000);
	});

	it('CANCELLATION_CLEANUP requires remove partial and mark failed', () => {
		expect(CANCELLATION_CLEANUP.REMOVE_PARTIAL).toBe(true);
		expect(CANCELLATION_CLEANUP.MARK_FAILED).toBe(true);
		expect(CANCELLATION_CLEANUP.RELEASE_LOCK).toBe(true);
	});
});
