'use client';

import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

type ServiceItem = {
  label: string;
  icon: string; // Can be a URL or emoji
};

type ServiceCarouselProps = {
  services: ServiceItem[];
};

const ServiceCarousel: FC<ServiceCarouselProps> = ({ services }) => {
  return (
    <div className="w-full px-4 py-2">
      <Swiper
        spaceBetween={12}
        slidesPerView={3.5}
        grabCursor
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-4 border hover:shadow-md transition-all duration-300">
              {/* Icon */}
              <div className="text-3xl mb-2">{service.icon}</div>
              {/* Label */}
              <p className="text-sm font-medium text-center">{service.label}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ServiceCarousel;
