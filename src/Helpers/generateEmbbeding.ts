import ollama from 'ollama';

export default async function generateEmbedding(text: string): Promise<number[]> {
  const embedding = await ollama.embed({
    model: 'nomic-embed-text-v2-moe',
    input: text,
  });
  return embedding.embeddings[0];
}