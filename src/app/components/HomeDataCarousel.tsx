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
    <div className="w-full">
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
            <div className="bg-white shadow-sm overflow-hidden ">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full aspect-[16/9] object-cover"
                  width={800}
                  height={267}
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
