import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fen } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN is required' });
  }

  try {
    const response = await fetch('https://chess.sneakyowl.net/chess_v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHESS_API_KEY}`,
      },
      body: JSON.stringify({ fen }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Chess V1] Selected Move:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching best move:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}