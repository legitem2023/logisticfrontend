'use client';
import Image from 'next/image';
import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
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
    <div className="w-full py-4">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto"
        grabCursor
        centeredSlides={false}
        pagination={{ clickable: true, dynamicBullets: true }}
        modules={[Pagination]}
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className="!w-[100%]">
            <div className="bg-white shadow-sm overflow-hidden rounded-lg">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full aspect-[3/1] object-cover"
                  width={800}
                  height={267}
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                )}
                {item.actionLabel && (
                  <button className="mt-2 text-blue-600 hover:underline">
                    {item.actionLabel}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeDataCarousel;
