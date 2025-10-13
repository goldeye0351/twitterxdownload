// src/app/api/test-db/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');  

    const response = await fetch(`https://api.twitterxdownload.com/api/requestdb?${action?`action=${action}`:''}`);
    const data = await response.json();
    
    return Response.json({
      message: 'from shared database',
      ...data
    });
}