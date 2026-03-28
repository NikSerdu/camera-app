/**
 * Склейка нескольких VOD media playlist (.m3u8) в один с #EXT-X-DISCONTINUITY между файлами.
 * URI сегментов делаются абсолютными относительно URL исходного плейлиста (presigned).
 */

export type StitchedChapterMeta = {
  recordingId: string;
  startSec: number;
  durationSec: number;
};

export function mergeVodHlsPlaylistsWithChapters(
  items: { playlistUrl: string; body: string; recordingId: string }[],
): { body: string; chapters: StitchedChapterMeta[] } {
  if (items.length === 0) {
    throw new Error('mergeVodHlsPlaylistsWithChapters: empty list');
  }

  let maxTarget = 3;
  const pieces: string[] = [];
  const chapters: StitchedChapterMeta[] = [];
  let cumulativeSec = 0;

  for (const { body, playlistUrl, recordingId } of items) {
    const { targetDuration, segmentBlocks, durationSec } = parseMediaPlaylist(
      body,
      playlistUrl,
    );
    if (segmentBlocks.length === 0) {
      continue;
    }
    chapters.push({
      recordingId,
      startSec: cumulativeSec,
      durationSec,
    });
    cumulativeSec += durationSec;
    maxTarget = Math.max(maxTarget, targetDuration);
    if (pieces.length > 0) {
      pieces.push('#EXT-X-DISCONTINUITY');
    }
    pieces.push(...segmentBlocks);
  }

  if (pieces.length === 0) {
    throw new Error('mergeVodHlsPlaylistsWithChapters: no segments found');
  }

  const body = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-TARGETDURATION:${Math.ceil(maxTarget)}`,
    '#EXT-X-MEDIA-SEQUENCE:0',
    ...pieces,
    '#EXT-X-ENDLIST',
  ].join('\n');

  return { body, chapters };
}

/** @deprecated используйте mergeVodHlsPlaylistsWithChapters */
export function mergeVodHlsPlaylists(
  items: { playlistUrl: string; body: string }[],
): string {
  const withIds = items.map((item, i) => ({
    ...item,
    recordingId: `__idx_${i}`,
  }));
  return mergeVodHlsPlaylistsWithChapters(withIds).body;
}

function parseMediaPlaylist(
  body: string,
  basePlaylistUrl: string,
): { targetDuration: number; segmentBlocks: string[]; durationSec: number } {
  let targetDuration = 3;
  const segmentBlocks: string[] = [];
  let durationSec = 0;
  const lines = body.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('#EXT-X-TARGETDURATION:')) {
      const v = Number(line.slice('#EXT-X-TARGETDURATION:'.length).trim());
      if (!Number.isNaN(v)) {
        targetDuration = Math.max(targetDuration, v);
      }
      continue;
    }

    if (line.startsWith('#EXTINF')) {
      durationSec += extinfLineDurationSec(line);
      const chunk: string[] = [line];
      let j = i + 1;
      while (j < lines.length) {
        const t = lines[j].trim();
        if (!t) {
          j++;
          continue;
        }
        if (t.startsWith('#')) {
          if (t === '#EXT-X-DISCONTINUITY') {
            j++;
            continue;
          }
          chunk.push(t);
          j++;
          continue;
        }
        const abs = new URL(t, basePlaylistUrl).href;
        chunk.push(abs);
        segmentBlocks.push(chunk.join('\n'));
        i = j;
        break;
      }
    }
  }

  return { targetDuration, segmentBlocks, durationSec };
}

function extinfLineDurationSec(extinfLine: string): number {
  const m = /^#EXTINF:([\d.]+),/.exec(extinfLine.trim());
  return m ? parseFloat(m[1]) : 0;
}
