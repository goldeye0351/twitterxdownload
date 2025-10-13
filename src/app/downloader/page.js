'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from '@/app/components/ui/Hero';
import { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { parseTweetData } from '@/lib/parser';

// 懒加载组件，确保在 Suspense 中加载
const TweetCard = lazy(() => import('@/app/components/ui/TweetCard'));

// 创建一个独立的组件来使用 useSearchParams，便于被 Suspense 包裹
const SearchParamsWrapper = ({ onUrlChange }) => {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  
  // 当组件挂载时传递初始 URL
  useEffect(() => {
    onUrlChange(initialUrl);
  }, [initialUrl, onUrlChange]);
  
  return null;
};

export default function Downloader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [remainApiCount, setRemainApiCount] = useState(0);
  const [tweetData, setTweetData] = useState(null);
  const [originTweets, setOriginTweets] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [url, setUrl] = useState('');
  const retryTimes = useRef(0);

  // 处理 URL 变化
  const handleUrlChange = (newUrl) => {
    if (newUrl && newUrl !== url) {
      setUrl(newUrl);
    }
  };

  // 当 URL 变化时获取数据
  useEffect(() => {
    if (url) {
      setIsLoading(true);
      fetchTweet(url);
    }
    fetchRemainApiCount();
  }, [url]);

  const fetchRemainApiCount = async () => {
    try {
      const response = await fetch('/api/remains');
      const data = await response.json();
      setRemainApiCount(data.data);
    } catch (error) {
      console.error('Failed to fetch remaining API count:', error);
    }
  };

  const fetchTweet = async (url) => {
    try {
      const tweet_id = url.match(/status\/(\d{19})/)?.[1] || url.split('/').pop();
      const response = await fetch(`/api/requestx?tweet_id=${tweet_id}`);
      const data = await response.json();
      
      if (!data.success) {
        if (retryTimes.current < 3) {
          setTimeout(() => {
            console.log("retry fetch " + (retryTimes.current + 1));
            retryTimes.current++;
            fetchTweet(url);
          }, 1000 + Math.random() * 500);
        } else {
          retryTimes.current = 0;
          setIsLoading(false);
        }
        return;
      }

      retryTimes.current = 0;
      setIsLoading(false);
      setTweetData(data.data);

      const tempOriginTweets = parseTweetData(data.data);
      setOriginTweets(tempOriginTweets);

      const tempTweets = tempOriginTweets.map((tweet) => ({
        name: "name",
        screen_name: "screen_name",
        profile_image: "",
        tweet_text: tweet.text,
        tweet_media: tweet.medias.map((media) => media.url),
        medias_info: tweet.medias
      }));
      setTweets(tempTweets);

      fetchRemainApiCount();
      router.replace(`/downloader?url=${url}`);
    } catch (error) {
      console.error('Error fetching tweet:', error);
      setIsLoading(false);
      retryTimes.current = 0;
    }
  };

  return (
    <div className="page-container">
      {/* 用 Suspense 包裹使用 useSearchParams 的组件 */}
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper onUrlChange={handleUrlChange} />
      </Suspense>

      <div className="flex flex-col gap-4 justify-center items-center">
        <div>
          <Hero
            downloadButtonLabel="Fetch"
            downloadButtonIsLoading={isLoading}
            remainApiCount={remainApiCount}
            url={url}
            onDownload={(newUrl) => {
              setUrl(newUrl);
              setIsLoading(true);
              fetchTweet(newUrl);
            }}
          />
        </div>
      </div>
      
      <div className="flex gap-4 justify-center items-center flex-col">
        {tweetData && originTweets.length > 0 && (
          <Suspense fallback={<div>Loading tweet content...</div>}>
            <div className="w-full mt-3">
              {tweets.map((tweet, index) => (
                <TweetCard key={index} tweet={tweet} className="mb-2 cursor-auto select-text"/>
              ))}
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
}
