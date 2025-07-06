'use client';
import { Card, CardHeader, CardBody, CardFooter, Avatar,Chip,Button,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,Input,ToastProvider,addToast } from "@heroui/react";
import { useState } from "react";
import { RiCloseCircleFill,RiArrowDropDownLine,RiMoreFill } from "@remixicon/react"
import { getTranslation } from "@/lib/i18n";
import ConfirmModal from "./ConfirmModal";
import Link from "next/link";

export default function TweetCard({ tweet,videoPreview=true,enableEdit = false,locale='en', className,onDeleteTweet,onInsertTweet,onAddMedia,onDeleteMedia,onUpdateText }) {
    
    const t = function (key) {
        return getTranslation(locale, key);
    }

    const [textLength, setTextLength] = useState(tweet.tweet_text.length);
    const [savedPwd, setSavedPwd] = useState(localStorage.getItem('adminpwd') || '');

    const getMediaDom = (mediaUrl) => {
        if (mediaUrl.includes('.mp4') || mediaUrl.startsWith('data:video/mp4')) {
            return (
                <video preload={videoPreview ? 'auto' : 'none'} controls src={mediaUrl} alt="Tweet media" className="w-full h-full rounded-lg object-cover" />
            )
        }
        return (
            <img src={mediaUrl} alt="Tweet media" className="w-full h-full rounded-lg object-cover" />
         )
    }

    const handleDeleteMedia = (index) => {
        if(onDeleteMedia) onDeleteMedia(index);
    }
    const handleAddMedia = () => {
        if(onAddMedia) onAddMedia();
    }
    const handleInserTweet = () => {
        if(onInsertTweet) onInsertTweet();
    }
    const handleDeleteTweet = () => {   
        if(onDeleteTweet) onDeleteTweet();
    }
    const handleUpdateText = (text) => {
        if(onUpdateText) onUpdateText(text);
    }
    const handleActions = async (e) => {
        const passwordInputRef = { current: savedPwd };
        if(e === 'hidetweet'){
            const confirmed = await ConfirmModal.show({
                title: t('Warning'),
                description: <>
                    <div className="text-small text-default-400">{t('Hide this tweet from homepage?')}</div>
                    <Input autoComplete="on" defaultValue={savedPwd} name="adminpwd" type="password" onChange={(e) => {passwordInputRef.current = e.target.value;}} placeholder={t('Please enter the admin password')} />
                </>,
                cancelText: t('Cancel'),
                confirmText: t('Confirm')
            });
            if(!confirmed) return;
    
            if(passwordInputRef.current.trim() !== ''){
                const res = await fetch(`/api/tweet/hide?tweet_id=${tweet.tweet_id}&adminpwd=${passwordInputRef.current.trim()}`);
                if(res.ok){
                    addToast({
                        title: t('Tweet hidden successfully'),
                        description: t('This tweet will be hidden on homepage'),
                        color: 'success'
                    });
                    localStorage.setItem('adminpwd', passwordInputRef.current.trim());
                    setSavedPwd(passwordInputRef.current.trim());
                }else{
                    addToast({
                        title: t('Invalid admin password'),
                    });
                }
            }
        }else if(e === 'showtweet'){
            const confirmed = await ConfirmModal.show({
                title: t('Warning'),
                description: <>
                    <div className="text-small text-default-400">{t('Hide this tweet from homepage?')}</div>
                    <Input autoComplete="on" defaultValue={savedPwd} name="adminpwd" type="password" onChange={(e) => {passwordInputRef.current = e.target.value;}} placeholder={t('Please enter the admin password')} />
                </>,
                cancelText: t('Cancel'),
                confirmText: t('Confirm')
            });
            if(!confirmed) return;
    
            if(passwordInputRef.current.trim() !== ''){
                const res = await fetch(`/api/tweet/show?tweet_id=${tweet.tweet_id}&adminpwd=${passwordInputRef.current.trim()}`);
                if(res.ok){
                    addToast({
                        title: t('Tweet shown successfully'),
                        description: t('This tweet will be shown on homepage'),
                        color: 'success'
                    });
                    localStorage.setItem('adminpwd', passwordInputRef.current.trim());
                    setSavedPwd(passwordInputRef.current.trim());
                }else{
                    addToast({
                        title: t('Invalid admin password'),
                    });
                }
            }
        }else if(e === 'delete'){
            const confirmed = await ConfirmModal.show({
                title: t('Warning'),
                description: <>
                    <div className="text-small text-default-400">{t('Delete this tweet from database?')}</div>
                    <Input autoComplete="on" defaultValue={savedPwd} name="adminpwd" type="password" onChange={(e) => {passwordInputRef.current = e.target.value;}} placeholder={t('Please enter the admin password')} />
                </>,
                cancelText: t('Cancel'),
                confirmText: t('Confirm')
            });
            if(!confirmed) return;
    
            if(passwordInputRef.current.trim() !== ''){
                const res = await fetch(`/api/tweet/delete?tweet_id=${tweet.tweet_id}&adminpwd=${passwordInputRef.current.trim()}`);
                if(res.ok){
                    addToast({
                        title: t('Tweet deleted successfully'),
                        description: t('This tweet will be deleted from database'),
                        color: 'success'
                    });
                    localStorage.setItem('adminpwd', passwordInputRef.current.trim());
                    setSavedPwd(passwordInputRef.current.trim());
                }else{
                    addToast({
                        title: t('Invalid admin password'),
                    });
                }
            }
        }else if(e === 'hideaccount'){
            const confirmed = await ConfirmModal.show({
                title: t('Warning'),
                description: <>
                    <div className="text-small text-default-400">{t('Hide all tweets from this account on homepage?')}</div>
                    <Input autoComplete="on" defaultValue={savedPwd} name="adminpwd" type="password" onChange={(e) => {passwordInputRef.current = e.target.value;}} placeholder={t('Please enter the admin password')} />
                </>, 
                cancelText: t('Cancel'),
                confirmText: t('Confirm')
            });
            if(!confirmed) return;

            if(passwordInputRef.current.trim() !== ''){
                const res = await fetch(`/api/tweet/hide?screen_name=${tweet.screen_name}&adminpwd=${passwordInputRef.current.trim()}`);
                if(res.ok){
                    addToast({
                        title: t('Account hidden successfully'),
                        description: t('All tweets from this account will be hidden on homepage'),
                        color: 'success'
                    });
                    localStorage.setItem('adminpwd', passwordInputRef.current.trim());
                    setSavedPwd(passwordInputRef.current.trim());
                }else{
                    addToast({
                        title: t('Invalid admin password'),
                    });
                }
            }
        }
    }

    return (
        <>
            <ToastProvider placement="top-center"/>
            <Card
                shadow="none"
                isHoverable={!enableEdit}
                isPressable={!enableEdit}
                disableRipple={true}
                className={`tweet-card w-full p-2 cursor-pointer select-none border-foreground/10 border-[1px] rounded-2xl ${className}`}
                key={tweet.tweet_id}>
                <CardHeader as={!enableEdit ? Link : 'div'}
                href={`/tweets/${tweet.tweet_id}`} className="flex justify-between gap-4">
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
                href={`/tweets/${tweet.tweet_id}`} className="text-small text-default-400 pb-0">
                    <pre className={`whitespace-pre-wrap ${enableEdit ? "border-[1px] border-primary p-2 rounded-md text-foreground" : ""}`} contentEditable={enableEdit} onInput={(e) => {
                        setTextLength(e.target.innerText.length);
                    }} 
                    onBlur={(e) => {
                        handleUpdateText(e.target.innerText);
                    }} 
                    onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        document.execCommand('insertText', false, text);
                    }}
                    suppressContentEditableWarning={true}>{tweet.tweet_text}</pre>
                    {enableEdit && <div className='text-small text-default-400 text-right'>{textLength} / 280</div>}
                    {/* 图片显示逻辑 */}
                    {tweet.tweet_media && tweet.tweet_media.length > 0 && (
                        <div className="mt-3">
                            {tweet.tweet_media.length === 1 && (
                                <div className="w-full h-48 relative">
                                    {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(0)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                    {getMediaDom(tweet.tweet_media[0])}
                                </div>
                            )}

                            {tweet.tweet_media.length === 2 && (
                                <div className="flex gap-1">
                                    <div className="w-1/2 h-48 relative">
                                        {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(0)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                        {getMediaDom(tweet.tweet_media[0])}
                                    </div>
                                    <div className="w-1/2 h-48 relative">
                                        {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(1)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                        {getMediaDom(tweet.tweet_media[1])}
                                    </div>
                                </div>
                            )}

                            {tweet.tweet_media.length === 3 && (
                                <div className="flex gap-1 h-52">
                                    <div className="w-1/2 h-full relative">
                                        {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(0)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                        {getMediaDom(tweet.tweet_media[0])}
                                    </div>
                                    <div className="w-1/2 flex h-full flex-col gap-1 items-between">
                                        <div className="flex-1 h-24 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(1)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[1])}
                                        </div>
                                        <div className="flex-1 h-24 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(2)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[2])}
                                        </div>
                                    </div>
                                    
                                </div>
                            )}

                            {tweet.tweet_media.length === 4 && (
                                <div className="flex h-52 gap-1">
                                    <div className="w-1/2 flex flex-col h-full gap-1 items-between">
                                        <div className="h-24 flex-1 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(0)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[0])}
                                        </div>
                                        <div className="h-24 flex-1 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(1)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[1])}
                                        </div>
                                    </div>
                                    <div className="w-1/2 flex flex-col h-full gap-1 items-between">
                                        <div className="h-24 flex-1 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(2)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[2])}
                                        </div>
                                        <div className="h-24 flex-1 relative">
                                            {enableEdit && <RiCloseCircleFill onClick={() => handleDeleteMedia(3)} className="absolute z-10 top-2 right-2 text-white cursor-pointer bg-black rounded-full" />}
                                            {getMediaDom(tweet.tweet_media[3])}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {enableEdit && <div className='text-small text-default-400 flex justify-between mt-3'>
                        <div>
                            <Button size="sm" onPress={() => handleAddMedia()}>{t('Add Media')}</Button>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onPress={() => handleInserTweet()}>{t('Insert')}</Button>
                            <Button size="sm" onPress={() => handleDeleteTweet()}>{t('Delete')}</Button>
                        </div>
                    </div>}
                    

                </CardBody>
                <CardFooter className="py-0">
                {!enableEdit && <div className='text-small text-default-400 w-full flex justify-between items-center mt-1'>
                        <div>
                            {tweet.post_at && !enableEdit && <Chip color="default" variant="light" size="sm" className="text-foreground/50">
                            {new Date(tweet.post_at).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'numeric', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </Chip>}
                        </div>
                        {process.env.NEXT_PUBLIC_USE_SHARED_DB!='1' && <div>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button as="div" disableRipple isIconOnly size="sm" variant="light" className="text-foreground/50">
                                        <RiMoreFill />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions" onAction={handleActions}>
                                    <DropdownItem key={tweet.is_hidden ? 'showtweet' : 'hidetweet'}>{tweet.is_hidden ? t('Show this tweet') : t('Hide this tweet')}</DropdownItem>
                                    <DropdownItem key="delete">{t('Delete this tweet')}</DropdownItem>
                                    <DropdownItem key="hideaccount">{t('Hide this account')}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>}
                    </div>}
                </CardFooter>
            </Card>
        </>
    )
}