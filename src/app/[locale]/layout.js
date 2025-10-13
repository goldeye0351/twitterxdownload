import "../globals.css";
import {Providers} from "../providers";


export const metadata = {
  title: {
    default: 'TwitterXDownload - Free Twitter Video Downloader',
    template: '%s | TwitterXDownload'
  },
  description: 'Download Twitter videos and media content for free. No registration required. Fast and easy Twitter video downloader. Twitter Media Saver. Twitter X Download.',
  keywords: 'twitter downloader, x video downloader, twitter video download, x.com downloader',
  authors: [{ name: 'TwitterXDownload' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://twitterxdownload.com/',
  },
  openGraph: {
    title: 'TwitterXDownload - Free Twitter Video Downloader',
    description: 'Download Twitter videos and media content for free. No registration required.',
    type: 'website',
    url: 'https://twitterxdownload.com',
    siteName: 'TwitterXDownload',
    images: [{
      url: 'https://twitterxdownload.com/images/og.png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@twitterxdownload',
    title: 'TwitterXDownload - Free Twitter Video Downloader',
    description: 'Download Twitter videos and media content for free. No registration required.',
    images: ['https://twitterxdownload.com/images/og.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180' }
    ]
  }
};

export default function RootLayout({ children, params }) {
    const locale = params?.locale || 'en';

    return (
      <html lang={locale} suppressHydrationWarning>
        <body className="bg-background text-foreground">
            <Providers>
                {children}
            </Providers>
        </body>
      </html>
    );
  }