'use client';
import Image from 'next/image';
import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import InstallPWAButton from './InstallPWAButton';

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
    <div className="w-full max-w-7xl mx-auto relative group">
      <InstallPWAButton/>
      <Swiper
        spaceBetween={24}
        slidesPerView="auto"
        modules={[Autoplay, Pagination]}
        autoplay={{ 
          delay: 5000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        loop={true}
        grabCursor
        centeredSlides={true}
        pagination={{ clickable: true, dynamicBullets: true }}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className="!w-full md:!w-[90%] lg:!w-[80%] xl:!w-[70%]">
            <div className="bg-white shadow-xl overflow-hidden relative md:rounded-2xl transition-all duration-300 hover:shadow-2xl">
              {item.imageUrl && (
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={1200}
                    height={675}
                    className="object-cover w-full h-full aspect-[16/9]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-sm md:text-lg mt-2 md:mt-4 opacity-90 max-w-2xl drop-shadow-md">
                        {item.subtitle}
                      </p>
                    )}
                    {item.actionLabel && (
                      <button className="mt-4 md:mt-6 px-6 py-2 md:px-8 md:py-3 bg-white text-black font-medium rounded-full text-sm md:text-base w-fit hover:bg-opacity-90 transition-all transform hover:scale-105">
                        {item.actionLabel}
                      </button>
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
