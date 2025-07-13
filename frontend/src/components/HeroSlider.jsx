import React, { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://thumbs.dreamstime.com/b/knowledge-sharing-people-close-up-outdoors-two-students-exchanging-books-give-to-read-friend-149722527.jpg",
    title: "Welcome to BookExchange 📚",
    description:
      "Share your favorite books, discover new reads, and build a reading community around you.",
  },
  {
    image:
      "https://thumbs.dreamstime.com/b/cheerful-young-couple-spending-leisure-time-together-home-reading-book-drinking-coffee-sharing-joyous-moment-383681565.jpg",
    title: "Read More, Spend Less",
    description:
      "Exchange your unused books and get access to a world of knowledge for free.",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-8l6Mwom058IJoTUgZH0QGauqjVLrR0vcUA&s",
    title: "Eco-Friendly Book Sharing 🌱",
    description:
      "Support sustainable living by giving books a second life through our platform.",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[100vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay with gradient and blur */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 backdrop-blur-sm flex flex-col justify-center items-center text-white px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-md sm:text-lg md:text-xl max-w-2xl drop-shadow">
              {slide.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSlider;
