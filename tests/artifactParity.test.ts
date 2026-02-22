/**
 * Artifact parity tests.
 * Asserts artifact format constants and structure remain stable.
 */

import { describe, it, expect } from 'vitest';
import {
	ARTIFACT_FORMAT_VERSION,
	ARTIFACT_CONTAINER,
	SUPPORTED_INPUT_CONTAINERS,
	COPYABLE_AUDIO_CODECS,
	ADAPTIVE_AUDIO_EAC3,
	ADAPTIVE_AUDIO_AAC,
	TRACK_MAPPING_VIDEO,
	TRACK_MAPPING_AUDIO_PATTERN,
	HEVC_TAG,
	ARTIFACT_DIR_STRUCTURE
} from '../src/artifactSpec.js';

describe('artifactParity', () => {
	it('ARTIFACT_FORMAT_VERSION is numeric', () => {
		expect(typeof ARTIFACT_FORMAT_VERSION).toBe('number');
		expect(ARTIFACT_FORMAT_VERSION).toBeGreaterThanOrEqual(1);
	});

	it('ARTIFACT_CONTAINER is mp4', () => {
		expect(ARTIFACT_CONTAINER).toBe('mp4');
	});

	it('SUPPORTED_INPUT_CONTAINERS includes mkv, m2ts, ts, mp4', () => {
		expect(SUPPORTED_INPUT_CONTAINERS).toContain('mkv');
		expect(SUPPORTED_INPUT_CONTAINERS).toContain('m2ts');
		expect(SUPPORTED_INPUT_CONTAINERS).toContain('ts');
		expect(SUPPORTED_INPUT_CONTAINERS).toContain('mp4');
	});

	it('COPYABLE_AUDIO_CODECS includes aac, ac3, eac3', () => {
		expect(COPYABLE_AUDIO_CODECS).toContain('aac');
		expect(COPYABLE_AUDIO_CODECS).toContain('ac3');
		expect(COPYABLE_AUDIO_CODECS).toContain('eac3');
	});

	it('ADAPTIVE_AUDIO_EAC3 has expected structure', () => {
		expect(ADAPTIVE_AUDIO_EAC3.codec).toBe('eac3');
		expect(ADAPTIVE_AUDIO_EAC3.channels).toBe(6);
		expect(ADAPTIVE_AUDIO_EAC3.bitrate).toBe('640k');
	});

	it('ADAPTIVE_AUDIO_AAC has expected structure', () => {
		expect(ADAPTIVE_AUDIO_AAC.codec).toBe('aac');
		expect(ADAPTIVE_AUDIO_AAC.channels).toBe(6);
		expect(ADAPTIVE_AUDIO_AAC.bitrate).toBe('384k');
	});

	it('TRACK_MAPPING_VIDEO maps first video stream', () => {
		expect(TRACK_MAPPING_VIDEO).toBe('0:v:0');
	});

	it('TRACK_MAPPING_AUDIO_PATTERN has index placeholder', () => {
		expect(TRACK_MAPPING_AUDIO_PATTERN).toContain('{index}');
	});

	it('HEVC_TAG is hvc1', () => {
		expect(HEVC_TAG).toBe('hvc1');
	});

	it('ARTIFACT_DIR_STRUCTURE is flat', () => {
		expect(ARTIFACT_DIR_STRUCTURE).toBe('flat');
	});
});
