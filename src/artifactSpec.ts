/**
 * Artifact format specification.
 *
 * Artifact format is versioned. Breaking changes require ARTIFACT_FORMAT_VERSION bump.
 * Backend implementations must produce identical format.
 */

/**
 * Artifact format version. Bump on breaking changes to container, track mapping, naming,
 * or target profile semantics. Included in cache key; bumps invalidate cache reuse.
 */
export const ARTIFACT_FORMAT_VERSION = 1;

/**
 * Container type for playback artifacts.
 * Output is fragmented MP4 (fMP4) with movflags: +frag_keyframe+delay_moov+default_base_moof.
 */
export const ARTIFACT_CONTAINER = 'mp4' as const;

/** Supported input containers for artifact builds. */
export const SUPPORTED_INPUT_CONTAINERS = [
	'mkv',
	'm2ts',
	'ts',
	'webm',
	'avi',
	'mp4',
	'mov',
	'm4v'
] as const;

export type SupportedInputContainer = (typeof SUPPORTED_INPUT_CONTAINERS)[number];

/**
 * Track mapping rules:
 * - Video: map 0:v:0 (first video stream)
 * - Audio: map 0:a:N where N is target audio track index (default 0)
 * - Subtitles: separate artifact (subtitle_srt); not embedded in fMP4 for Apple TV
 */
export const TRACK_MAPPING_VIDEO = '0:v:0' as const;
export const TRACK_MAPPING_AUDIO_PATTERN = '0:a:{index}' as const;

/** Apple TV copy-compatible audio codecs (no transcode). */
export const COPYABLE_AUDIO_CODECS = ['aac', 'ac3', 'eac3'] as const;

/** Audio codecs requiring adaptive transcode (TrueHD, DTS, FLAC, Opus, PCM, etc.). */
export const ADAPTIVE_TRANSCODE_AUDIO = ['truehd', 'dts', 'dts_hd_ma', 'flac', 'opus', 'pcm'] as const;

/** Video codecs requiring full transcode (VP9, AV1, DV P7, etc.). */
export const TRANSCODE_VIDEO_CODECS = [
	'vp9',
	'av1',
	'mpeg2video',
	'vc1',
	'mpeg4',
	'prores'
] as const;

/** HEVC tag for compatibility (hvc1). */
export const HEVC_TAG = 'hvc1' as const;

/** Audio codec expectations for adaptive builds. */
export const ADAPTIVE_AUDIO_EAC3 = { codec: 'eac3' as const, channels: 6, bitrate: '640k' };
export const ADAPTIVE_AUDIO_AAC = { codec: 'aac' as const, channels: 6, bitrate: '384k' };

/**
 * File naming structure:
 * - Video artifacts: {mediaFileId}__{fingerprintShort}__remux_fmp4{suffix}.mp4
 * - Suffix: empty (remux), _adaptive_eac3, _adaptive_aac, _transcode
 * - Subtitle: {mediaFileId}__{fingerprintShort}__subtitles.srt
 * - Imported subtitle: {mediaFileId}__imported__subtitles.srt
 */
export const ARTIFACT_FILENAME_PATTERN = '{mediaFileId}__{fingerprintShort}__remux_fmp4{suffix}.mp4';
export const ARTIFACT_SUBTITLE_PATTERN = '{mediaFileId}__{fingerprintShort}__subtitles.srt';
export const ARTIFACT_IMPORTED_SUBTITLE_PATTERN = '{mediaFileId}__imported__subtitles.srt';

/**
 * Directory structure:
 * - Single cache directory (configurable path)
 * - All artifacts in flat layout under cache root
 * - No subdirectories by media_file_id or kind
 */
export const ARTIFACT_DIR_STRUCTURE = 'flat' as const;
