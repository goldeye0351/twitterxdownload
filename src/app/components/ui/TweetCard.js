'use client';
import { Card, CardHeader, CardBody, CardFooter, Avatar,Chip,Button,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,Input,ToastProvider,addToast } from "@heroui/react";
import { useState } from "react";
import { RiCloseCircleFill,RiArrowDropDownLine,RiMoreFill } from "@remixicon/react"

import Link from "next/link";

export default function TweetCard({ tweet,videoPreview=true,enableEdit = false,locale='en', className }) {
    

    const [textLength, setTextLength] = useState(tweet.tweet_text.length);


    const getMediaDom = (mediaUrl) => {
        if (mediaUrl.includes('.mp4') || mediaUrl.startsWith('data:video/mp4')) {
            return (<>
                <input key={mediaUrl} value={mediaUrl} className="w-full h-auto rounded-lg object-cover" />
                <video preload={videoPreview ? 'auto' : 'none'} controls src={mediaUrl} alt="Tweet media" className="w-full h-full rounded-lg object-cover" />
            </>
            )
        }
        return (<>
            <input key={mediaUrl} value={mediaUrl} className="w-full h-auto rounded-lg object-cover" />
            <img src={mediaUrl} alt="Tweet media" className="w-full h-full rounded-lg object-cover" />
            </>
         )
    }


    return (
        <>
            <Card
                shadow="none"
                isHoverable={!enableEdit}
                isPressable={!enableEdit}
                disableRipple={true}
                className={`tweet-card w-full p-2 cursor-pointer select-none border-foreground/10 border-[1px] rounded-2xl ${className}`}
                key={tweet.tweet_id}>
                <CardHeader as={!enableEdit ? Link : 'div'}
                href={`/tweets/${tweet.tweet_id}`} target="_blank" className="flex justify-between gap-4">
                    <Avatar
                        className="flex-shrink-0"
                        isBordered
                        radius="full"
                        size="md"
                        alt={`${tweet.name} avatar`}
                        src={tweet.profile_image}
                    />
                    <div className="flex-1 flex flex-col pt-1 items-start text-left overflow-hidden">
                        <h4 className="w-full text-small font-semibold leading-none text-default-600 overflow-hidden text-ellipsis whitespace-nowrap">{tweet.name}</h4>
                        <h5 className="w-full text-small tracking-tight text-default-400 overflow-hidden text-ellipsis whitespace-nowrap">@{tweet.screen_name}</h5>
                    </div>
                    {tweet.tweet_threadscount > 0 && <div>
                            <Chip color="default" variant="flat" size="sm" className="flex items-center gap-1 pl-2" endContent={<RiArrowDropDownLine />}>{tweet.tweet_threadscount}</Chip>
                        </div>}
                </CardHeader>
                <CardBody as={!enableEdit ? Link : 'div'}
                href={`/tweets/${tweet.tweet_id}`} target="_blank" className=" flex flex-col min-h-96">
                    <pre className={`whitespace-pre-wrap ${enableEdit ? "border-[1px] border-primary p-2 rounded-md text-foreground" : ""}`} 
                        contentEditable={enableEdit} onInput={(e) => {
                        setTextLength(e.target.innerText.length);
                    }} 

                    suppressContentEditableWarning={true}>{tweet.tweet_text}</pre>
                    {enableEdit && <div className='text-small text-default-400 text-right'>{textLength} / 280</div>}
                    {/* 图片显示逻辑 */}
                    {tweet.tweet_media && tweet.tweet_media.length > 0 && (
                        <div className="mt-3">
                            {tweet.tweet_media.length === 1 && (
                                <div className="w-full h-48 relative">
                                    {getMediaDom(tweet.tweet_media[0])}
                                </div>
                            )}

                            {tweet.tweet_media.length === 2 && (
                                <div className="flex gap-1">
                                    <div className="w-1/2 h-48 relative">
                                        {getMediaDom(tweet.tweet_media[0])}
                                    </div>
                                    <div className="w-1/2 h-48 relative">
                                        {getMediaDom(tweet.tweet_media[1])}
                                    </div>
                                </div>
                            )}

                            {tweet.tweet_media.length === 3 && (
                                <div className="flex gap-1 h-52">
                                    <div className="w-1/2 h-full relative">
                                        {getMediaDom(tweet.tweet_media[0])}
                                    </div>
                                    <div className="w-1/2 flex h-full flex-col gap-1 items-between">
                                        <div className="flex-1 h-24 relative">
                                            {getMediaDom(tweet.tweet_media[1])}
                                        </div>
                                        <div className="flex-1 h-24 relative">
                                            {getMediaDom(tweet.tweet_media[2])}
                                        </div>
                                    </div>
                                    
                                </div>
                            )}

                            {tweet.tweet_media.length === 4 && (
                                <div className="flex h-52 gap-1">
                                    <div className="w-1/2 flex flex-col h-full gap-1 items-between">
                                        <div className="h-24 flex-1 relative">
                                            {getMediaDom(tweet.tweet_media[0])}
                                        </div>
                                        <div className="h-24 flex-1 relative">
                                            {getMediaDom(tweet.tweet_media[1])}
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex flex-col h-full gap-1 items-between">
                                        <div className="h-24 flex-1 relative">
                                            {getMediaDom(tweet.tweet_media[2])}
                                        </div>
                                        <div className="h-24 flex-1 relative">
                                            {getMediaDom(tweet.tweet_media[3])}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}                  
                    

                </CardBody>
                
            </Card>
        </>
    )
}