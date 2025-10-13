export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tweet_id = searchParams.get('tweet_id');

    if (!tweet_id) {
        return Response.json({
            success: false,
            error: 'Tweet ID is required'
        }, { status: 400 });
    }
        const response = await fetch(`https://api.twitterxdownload.com/api/requestx?${tweet_id?`tweet_id=${tweet_id}`:''}`);
        const data = await response.json();
        
        return Response.json({
          ...data,
          message: 'from shared database'
        });
}