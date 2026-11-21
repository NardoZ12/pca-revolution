import { Room } from 'livekit-client';

export interface LiveKitSession {
  room: Room;
  livekitUrl: string;
  token: string;
}

export async function createLiveKitSession(params: {
  roomName: string;
  participantName: string;
  participantIdentity: string;
  role: 'teacher' | 'student';
}): Promise<LiveKitSession> {
  const response = await fetch('/api/livekit/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'No se pudo obtener acceso al aula LiveKit.');
  }

  const { token, livekitUrl } = await response.json();
  if (!token || !livekitUrl) {
    throw new Error('El servidor no devolvió una sesión LiveKit válida.');
  }

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });

  await room.connect(livekitUrl, token);
  return { room, livekitUrl, token };
}
