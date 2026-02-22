/**
 * Adaptive build pipeline.
 * Orchestrates builds via BuildBackend interface only.
 * No dependency on concrete ffmpeg implementations.
 */

import type { BuildBackend, SourceInput, TargetProfile, ArtifactResult, AbortSignal } from './buildBackend.js';
import { SUPPORTED_INPUT_CONTAINERS } from './artifactSpec.js';

/** Validates source and delegates to backend. */
export async function buildForTarget(
	backend: BuildBackend,
	source: SourceInput,
	targetProfile: TargetProfile,
	abortSignal?: AbortSignal
): Promise<ArtifactResult> {
	validateSourceForBuild(source);
	return backend.buildAdaptive(source, targetProfile, abortSignal);
}

/** Validate source has required fields and supported container. */
function validateSourceForBuild(source: SourceInput): void {
	if (source.probe_state !== 'ok') {
		throw new Error('Media must be analyzed first');
	}
	const container = (source.container ?? '').toLowerCase();
	const supported = new Set(SUPPORTED_INPUT_CONTAINERS);
	if (!supported.has(container as (typeof SUPPORTED_INPUT_CONTAINERS)[number])) {
		throw new Error(
			`Artifact build requires ${SUPPORTED_INPUT_CONTAINERS.join(', ')} container (got ${container})`
		);
	}
}
