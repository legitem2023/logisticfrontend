/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['readymadeui.com',
                  'picsum.photos',
                  'localhost',
                  'tsbriguuaznlvwbnylop.supabase.co',
                  '192.168.100.86',
                  'cdn-icons-png.flaticon.com',
                  'hokei-storage.s3.ap-northeast-1.amazonaws.com',
                  'client-legitem.vercel.app',
                  'new-client-legitem.vercel.app',
                  'modelviewer.dev',
                  'https://tsbriguuaznlvwbnylop.supabase.co'
                 ],
      },
}

module.exports = nextConfig
