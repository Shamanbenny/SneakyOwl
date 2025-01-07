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

    // Handle non-200 HTTP responses
    if (!response.ok) {
      // Attempt to parse the error response body, if any
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = `Response Body: ${JSON.stringify(errorData)}`;
      } catch (parseError) {
        errorDetail = "Unable to parse response body.";
      }

      throw new Error(
        `API Error: ${response.status} ${response.statusText}. ${errorDetail}`
      );
    }

    const data = await response.json();
    console.log('[Chess V1] Selected Move:', data);
    res.status(200).json(data);
  } catch (error) {
    // Log detailed error information
    console.error('Error fetching best move:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
    });
  
    // Return a helpful error message to the client
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}