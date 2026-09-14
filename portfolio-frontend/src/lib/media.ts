export function isVideoUrl(url: string) {
  return /\.(mp4|webm)(\?|$)/i.test(url);
}