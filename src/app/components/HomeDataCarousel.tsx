'use client';
import Image from 'next/image';
import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actionLabel?: string;
};

type Props = {
  items: CarouselItem[];
};

const HomeDataCarousel: FC<Props> = ({ items }) => {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto"
        modules={[Autoplay,Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        grabCursor
        centeredSlides={false}
        pagination={{ clickable: true, dynamicBullets: true }}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className="!w-[100%]">
            <div className="bg-white shadow-sm overflow-hidden relative">
              {item.imageUrl && (
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    fill
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                    {item.subtitle && (
                      <p className="text-sm mt-1">{item.subtitle}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeDataCarousel;
