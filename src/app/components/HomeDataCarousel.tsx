'use client';
import Image from 'next/image';
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
    <div className="w-full py-4 aspect-[3/1]">
      <Swiper
        spaceBetween={12}
        slidesPerView="auto"
        grabCursor
        centeredSlides={false}
      >
        {items.map(item => (
          <SwiperSlide
            key={item.id}
            className="!w-[100%]"
          >
            <div className="bg-white shadow-sm overflow-hidden">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeDataCarousel;
