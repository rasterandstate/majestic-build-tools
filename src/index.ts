/**
 * majestic-build-tools
 *
 * Canonical, deterministic build pipeline for Majestic.
 * Defines: adaptive build logic, artifact generation rules, cache semantics,
 * lock semantics, backend execution interface.
 */

export type {
	BuildBackend,
	SourceInput,
	TargetProfile,
	ArtifactResult,
	AbortSignal
} from './buildBackend.js';

export type {
	ProbeResult,
	MediaProbeResult,
	MediaProbeError,
	SubtitleFormat,
	AudioTrackInfo,
	SubtitleTrackInfo
} from './probe.js';

export {
	ARTIFACT_FORMAT_VERSION,
	ARTIFACT_CONTAINER,
	SUPPORTED_INPUT_CONTAINERS,
	TRACK_MAPPING_VIDEO,
	TRACK_MAPPING_AUDIO_PATTERN,
	COPYABLE_AUDIO_CODECS,
	ADAPTIVE_TRANSCODE_AUDIO,
	TRANSCODE_VIDEO_CODECS,
	HEVC_TAG,
	ADAPTIVE_AUDIO_EAC3,
	ADAPTIVE_AUDIO_AAC,
	ARTIFACT_FILENAME_PATTERN,
	ARTIFACT_SUBTITLE_PATTERN,
	ARTIFACT_IMPORTED_SUBTITLE_PATTERN,
	ARTIFACT_DIR_STRUCTURE
} from './artifactSpec.js';

export type { SupportedInputContainer } from './artifactSpec.js';

export {
	buildCacheKey,
	ARTIFACT_REUSE_CONDITIONS,
	EVICTION_SAFETY_WINDOW_MS,
	CANCELLATION_CLEANUP
} from './cachePolicy.js';

export type { CacheKeyInput } from './cachePolicy.js';

export {
	lockKey,
	LOCK_ACQUISITION,
	LOCK_RELEASE,
	CANCELLATION_LOCK_CLEANUP
} from './lockPolicy.js';

export { buildForTarget } from './adaptivePipeline.js';
