import { getTranslation } from '@/lib/i18n';
import HotTweets from '@/app/components/ui/HotTweets';
//import FAQ from '@/app/components/ui/FAQ';
import HotCreators from '@/app/components/ui/HotCreators';
import Hero from '@/app/components/ui/Hero';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'
import ThemeSwitcher from '@/app/components/ui/ThemeSwitcher';



export default async function Home({ params: { locale } }) {
  const t = function (key) {
    return getTranslation(locale, key);
  }
  
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  
  const baseUrl = `${protocol}://${host}`
  const remainApiResp = await fetch(`${baseUrl}/api/remains`,{
    cache: 'no-store'
  });
  const remainApiCountData = await remainApiResp.json();
  const remainApiCount = remainApiCountData.data;

  return (
    <>
      <div className="page-container">
        <div className="section">
          <Hero locale={locale} remainApiCount={remainApiCount} onDownload={async (url) => {
            'use server';
            redirect(`/downloader?url=${url}`);
          }} />
        </div>
        {process.env.NEXT_PUBLIC_HOME_LISTING != 0 && (
        <>
          <div className="section">
            <HotCreators locale={locale} />
          </div>
          <div className="section">
            <HotTweets locale={locale} />
          </div>
        </>
        )}

      </div>
    </>
  );
}