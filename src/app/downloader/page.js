'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from '@/app/components/ui/Hero';
import { useState, useEffect } from 'react';
import { Link,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,Button, Drawer, DrawerContent, DrawerBody, DrawerHeader, useDisclosure } from '@heroui/react';
import RePublishPanel from '@/app/components/ui/RePublishPanel';
import { parseTweetData } from '@/lib/parser';
import TweetCard from '@/app/components/ui/TweetCard';


export default function Downloader({ params: { locale } }) {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [remainApiCount, setRemainApiCount] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [tweetData, setTweetData] = useState(null);
    const [originTweets, setOriginTweets] = useState([]);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        if(url) {
            setIsLoading(true);
            fetchTweet(url);
        }
        fetchRemainApiCount();
    }, []);

    const fetchRemainApiCount = async () => {
        const response = await fetch('/api/remains');
        const data = await response.json();
        setRemainApiCount(data.data);
    }

    let retryTimes = 0;
    const fetchTweet = async (url) => {
        const tweet_id = url.match(/status\/(\d{19})/)?.[1] || url.split('/').pop();
        const response = await fetch(`/api/requestx?tweet_id=${tweet_id}`);
        const data = await response.json();
        

        if(!data.success){
            // 如果请求失败,最多重试3次
            // 每次重试的间隔时间需要随机在 1000-1500ms 之间
            if(retryTimes < 3){
                setTimeout(() => {
                    console.log("retry fetch " + (retryTimes+1));
                    fetchTweet(url);
                    retryTimes++;
                }, 1000 + Math.random() * 500);
            }else{
                retryTimes = 0;
                setIsLoading(false);
            }
            return;
        }

        setIsLoading(false);
        setTweetData(data.data);

        const tempOriginTweets = parseTweetData(data.data);
        setOriginTweets(tempOriginTweets);

        const tempTweets = tempOriginTweets.map((tweet) => {
            return {
                name: "name",
                screen_name: "screen_name",
                profile_image: "",
                tweet_text: tweet.text,
                tweet_media: tweet.medias.map((media) => media.url),
                medias_info: tweet.medias
            }
        });
        setTweets(tempTweets);
        console.log(tempTweets);

        fetchRemainApiCount();

        router.replace(`/downloader?url=${url}`);
    }

    return (
        <div className="page-container">
            <Drawer isOpen={isOpen} isDismissable={false} hideCloseButton={true} size="md" radius="none" onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <div className="text-medium font-semibold">Re-Publish</div>
                    </DrawerHeader>
                    <DrawerBody>
                        <RePublishPanel tweets={tweets} onClose={()=>{
                            onOpenChange(false);
                        }} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <div className="flex flex-col gap-4 justify-center items-center">
                <div className="">
                    <Hero
                        downloadButtonLabel="Fetch"
                        downloadButtonIsLoading={isLoading}
                        remainApiCount={remainApiCount}
                        url={url}
                        onDownload={(url) => {
                            setIsLoading(true);
                            fetchTweet(url);
                        }}
                    />
                </div>
            </div>
            <div className="flex gap-4 justify-center items-center flex-col">
                { tweetData && originTweets.length > 0 && (
                    <>
                            <div className="w-full mt-3">
                                {tweets.map((tweet, index) => {
                                    return <TweetCard key={index} tweet={tweet} enableEdit={true} className="mb-2 cursor-auto select-text"/>
                                })}
                            </div>

                    </>
                )}
            </div>
        </div>
    )
}