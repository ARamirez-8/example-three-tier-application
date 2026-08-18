export async function GET() {
  const API_URL = process.env.API_URL || 'http://localhost:3001';
  
  try {
    const res = await fetch(`${API_URL}/todos`);
    if (!res.ok) {
      throw new Error('Failed to fetch todos');
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}
