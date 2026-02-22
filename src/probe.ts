/**
 * Probe interface for media file metadata extraction.
 * Backend implementations (e.g. ffprobe) produce ProbeResult.
 */

/** Normalized subtitle format. Used for device compatibility. */
export type SubtitleFormat = 'srt' | 'webvtt' | 'mov_text' | 'pgs' | 'vobsub' | 'ass';

/** Single audio track from probe. */
export interface AudioTrackInfo {
	index: number;
	codec: string;
	channels: number;
	language: string | null;
	title: string | null;
}

/** Single subtitle track from probe. */
export interface SubtitleTrackInfo {
	index: number;
	language: string | null;
	format: SubtitleFormat;
	title: string | null;
	is_sdh?: boolean;
	is_forced?: boolean;
	is_default?: boolean;
}

/** Successful probe result. Maps to capability fields. */
export interface MediaProbeResult {
	ok: true;
	container: string | null;
	video_codec: string | null;
	video_profile: string | null;
	video_level: string | null;
	bit_depth: number | null;
	hdr_format: string | null;
	resolution_width: number | null;
	resolution_height: number | null;
	frame_rate: string | null;
	audio_codec: string | null;
	audio_channels: number | null;
	audio_bit_depth: number | null;
	audio_sample_rate: number | null;
	subtitle_formats: SubtitleFormat[];
	subtitle_tracks: SubtitleTrackInfo[];
	duration: number | null;
	audio_tracks: AudioTrackInfo[];
}

/** Probe error. */
export interface MediaProbeError {
	ok: false;
	error: string;
}

/** Probe result: success or error. */
export type ProbeResult = MediaProbeResult | MediaProbeError;
