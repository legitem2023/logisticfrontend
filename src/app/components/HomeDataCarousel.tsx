'use client';

import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
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
      >
        {items.map(item => (
          <SwiperSlide
            key={item.id}
            className="!w-[80%] sm:!w-[45%] md:!w-[30%] lg:!w-[22%]"
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                )}
                {item.actionLabel && (
                  <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-xs">
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
