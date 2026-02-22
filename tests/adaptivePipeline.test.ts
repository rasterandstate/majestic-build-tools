/**
 * Adaptive pipeline tests.
 * Asserts validation and backend delegation.
 */

import { describe, it, expect, vi } from 'vitest';
import { buildForTarget } from '../src/adaptivePipeline.js';
import type { BuildBackend, SourceInput, TargetProfile, ArtifactResult } from '../src/buildBackend.js';

function createMockBackend(result: ArtifactResult): BuildBackend {
	return {
		probe: vi.fn().mockResolvedValue({ ok: false, error: 'mock' }),
		buildAdaptive: vi.fn().mockResolvedValue(result)
	};
}

describe('adaptivePipeline', () => {
	it('rejects source with probe_state not ok', async () => {
		const backend = createMockBackend({ path: '/x', sizeBytes: 0, kind: 'remux' });
		const source: SourceInput = {
			path: '/test.mkv',
			container: 'mkv',
			video_codec: 'h264',
			audio_codec: 'aac',
			hdr_format: null,
			duration: 100,
			probe_state: 'failed'
		};
		await expect(buildForTarget(backend, source, { kind: 'remux_fmp4_appletv' })).rejects.toThrow(
			'Media must be analyzed first'
		);
		expect(backend.buildAdaptive).not.toHaveBeenCalled();
	});

	it('rejects unsupported container', async () => {
		const backend = createMockBackend({ path: '/x', sizeBytes: 0, kind: 'remux' });
		const source: SourceInput = {
			path: '/test.xyz',
			container: 'xyz',
			video_codec: 'h264',
			audio_codec: 'aac',
			hdr_format: null,
			duration: 100,
			probe_state: 'ok'
		};
		await expect(buildForTarget(backend, source, { kind: 'remux_fmp4_appletv' })).rejects.toThrow(
			/Artifact build requires/
		);
		expect(backend.buildAdaptive).not.toHaveBeenCalled();
	});

	it('delegates to backend for valid source', async () => {
		const result: ArtifactResult = { path: '/cache/1__abc__remux_fmp4.mp4', sizeBytes: 1000, kind: 'remux_fmp4_appletv' };
		const backend = createMockBackend(result);
		const source: SourceInput = {
			path: '/test.mkv',
			container: 'mkv',
			video_codec: 'h264',
			audio_codec: 'aac',
			hdr_format: null,
			duration: 100,
			probe_state: 'ok'
		};
		const out = await buildForTarget(backend, source, { kind: 'remux_fmp4_appletv' });
		expect(out).toEqual(result);
		expect(backend.buildAdaptive).toHaveBeenCalledWith(source, { kind: 'remux_fmp4_appletv' }, undefined);
	});
});
