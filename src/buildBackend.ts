/**
 * Backend execution interface for the Majestic build pipeline.
 * Implementations must satisfy this contract.
 * adaptivePipeline depends only on this interface, not concrete implementations.
 */

import type { ProbeResult } from './probe.js';

/** Minimal source metadata for build decisions. Backend receives path + probe data. */
export interface SourceInput {
	path: string;
	/** From probe or registry. Required for build. */
	container: string | null;
	video_codec: string | null;
	audio_codec: string | null;
	hdr_format: string | null;
	duration: number | null;
	/** Must be 'ok' for build. */
	probe_state: 'ok' | 'failed' | 'unknown' | null;
}

/**
 * Target device profile. Determines artifact kind and codec choices.
 * Profile semantics are tied to ARTIFACT_FORMAT_VERSION; changes require version bump.
 */
export interface TargetProfile {
	/** Artifact kind: remux_fmp4_appletv, remux_fmp4_appletv_adaptive_*, transcode_fmp4_appletv, etc. */
	kind: string;
	/** Audio track index when multi-track. Default 0. */
	audioTrackIndex?: number;
	/** Force audio codec for adaptive (aac | eac3). */
	forceAudioCodec?: 'aac' | 'eac3';
}

/** Result of a successful build. */
export interface ArtifactResult {
	path: string;
	sizeBytes: number;
	kind: string;
}

/** Abort signal for build cancellation. */
export type AbortSignal = { addEventListener(type: 'abort', fn: () => void): void };

/**
 * Build backend interface.
 * Implementations must produce artifacts conforming to artifactSpec.
 */
export interface BuildBackend {
	/** Probe a media file. Returns normalized metadata or error. */
	probe(filePath: string): Promise<ProbeResult>;

	/** Build adaptive artifact for target profile. Returns path or throws. */
	buildAdaptive(
		file: SourceInput,
		targetProfile: TargetProfile,
		abortSignal?: AbortSignal
	): Promise<ArtifactResult>;
}
