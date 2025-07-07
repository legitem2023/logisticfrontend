'use client';

import { FC, ReactNode, useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';

type Tab = {
  label: string;
  content: ReactNode;
};

type SwiperTabsProps = {
  tabs: Tab[];
};

const SwiperTabs: FC<SwiperTabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperCore | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIndex]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="w-full">
      {/* Tab headers */}
      <div className="relative flex space-x-4 border-b w-[100%] overflow-x">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            
            className={`relative py-3 px-4 text-sm font-medium transition-colors duration-300 ${
              activeIndex === index
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
        {/* Animated underline */}
        <span
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
        />
      </div>

      {/* Swiper slides */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        slidesPerView={1}
        resistanceRatio={0.5}
      >
        {tabs.map((tab, index) => (
          <SwiperSlide key={index}>{tab.content}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperTabs;
