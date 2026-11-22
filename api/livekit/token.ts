import { VercelRequest, VercelResponse } from '@vercel/node';
import { AccessToken, TrackSource } from 'livekit-server-sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomName, participantName, participantIdentity, role } = req.body || {};

  if (
    typeof roomName !== 'string' ||
    typeof participantName !== 'string' ||
    typeof participantIdentity !== 'string' ||
    !['teacher', 'student'].includes(role)
  ) {
    return res.status(400).json({ error: 'Datos de sala LiveKit incompletos.' });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    console.error('LiveKit config missing:', { apiKey: !!apiKey, apiSecret: !!apiSecret, livekitUrl: !!livekitUrl });
    return res.status(503).json({
      error: 'LiveKit no está configurado en el servidor.',
    });
  }

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
      ttl: '2h',
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canPublishSources: role === 'teacher'
        ? [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE]
        : [TrackSource.CAMERA, TrackSource.MICROPHONE],
    });

    const jwt = await token.toJwt();
    console.log(`✅ LiveKit token generated for ${participantIdentity} in room ${roomName}`);

    return res.json({
      token: jwt,
      livekitUrl,
    });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return res.status(500).json({ error: 'No se pudo crear el token de LiveKit.' });
  }
}
