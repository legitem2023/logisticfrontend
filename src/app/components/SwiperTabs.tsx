// 'use client';

// import { FC, ReactNode, useRef, useState, useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import 'swiper/css';

// type Tab = {
//   label: string;
//   content: ReactNode;
// };

// type SwiperTabsProps = {
//   tabs: Tab[];
// };

// const SwiperTabs: FC<SwiperTabsProps> = ({ tabs }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const swiperRef = useRef<SwiperCore | null>(null);
//   const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

//   const [underlineStyle, setUnderlineStyle] = useState({
//     left: 0,
//     width: 0,
//   });

//   useEffect(() => {
//     const el = tabRefs.current[activeIndex];
//     if (el) {
//       const { offsetLeft, offsetWidth } = el;
//       setUnderlineStyle({ left: offsetLeft, width: offsetWidth });

//       // Auto-scroll to active tab if overflowed
//       el.scrollIntoView({
//         behavior: 'smooth',
//         inline: 'center',
//         block: 'nearest',
//       });
//     }
//   }, [activeIndex]);

//   const handleTabClick = (index: number) => {
//     setActiveIndex(index);
//     if (swiperRef.current) {
//       swiperRef.current.slideTo(index);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Tab headers */}
//       <div
//         ref={scrollContainerRef}
//         className="relative overflow-x-auto no-scrollbar border-b"
//       >
//         <div className="flex space-x-4 relative w-max px-2">
//           {tabs.map((tab, index) => (
//             <button
//               key={index}
//               ref={(el) => {
//                 tabRefs.current[index] = el;
//               }}
//               className={`relative py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
//                 activeIndex === index
//                   ? 'text-green-600'
//                   : 'text-gray-500 hover:text-blue-500'
//               }`}
//               onClick={() => handleTabClick(index)}
//             >
//               {tab.label}
//             </button>
//           ))}

//           {/* Animated underline */}
//           <span
//             className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300"
//             style={{
//               left: underlineStyle.left,
//               width: underlineStyle.width,
//             }}
//           />
//         </div>
//       </div>

//       {/* Swiper slides */}
//       <Swiper
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//         slidesPerView={1}
//         resistanceRatio={0.5}
//       >
//         {tabs.map((tab, index) => (
//           <SwiperSlide key={index}>{tab.content}</SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default SwiperTabs;
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });

      el.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
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
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-auto no-scrollbar border-b scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex w-max lg:justify-center space-x-4 relative px-4 py-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              ref={(el) => {tabRefs.current[index] = el}}
              className={`min-w-[100px] py-3 px-6 text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors duration-300 ${
                activeIndex === index
                  ? 'text-green-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>
          ))}

          {/* Animated underline */}
          <span
            className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300"
            style={{
              left: underlineStyle.left,
              width: underlineStyle.width,
              transitionProperty: 'left, width',
            }}
          />
        </div>
      </div>

      {/* Swiper slides */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        slidesPerView={1}
        resistanceRatio={0.5}
        spaceBetween={16}
      >
        {tabs.map((tab, index) => (
          <SwiperSlide key={index}>
            <div className="px-4 py-6 sm:px-6 md:px-12 lg:px-16">
              {tab.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperTabs;
