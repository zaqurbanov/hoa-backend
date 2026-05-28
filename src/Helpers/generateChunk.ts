export default function chunkText(
  text: string,
  size: number = 600,
  overlapSentences: number = 1,
) {
  const cleanedText = text.replace(/\s+/g, ' ').trim();

  const sentences =
    cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];

  const chunks: string[] = [];

  let currentChunk: string[] = [];

  for (const sentence of sentences) {
    const joined = [...currentChunk, sentence].join(' ');

    if (joined.length > size) {
      chunks.push(currentChunk.join(' '));

      currentChunk = currentChunk.slice(-overlapSentences);
    }

    currentChunk.push(sentence);
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}