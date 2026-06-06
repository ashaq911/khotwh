"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    title: "New Season Arrivals",
    subtitle: "Discover the latest trends in Egyptian fashion",
    cta: "Shop Now",
    href: "/products",
    bg: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
  },
  {
    title: "Summer Collection 2026",
    subtitle: "Stay cool with our lightweight fabrics",
    cta: "Explore",
    href: "/products?category=women",
    bg: "bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900",
  },
  {
    title: "Buy 2 Get 1 Free",
    subtitle: "On all accessories. Limited time offer!",
    cta: "Shop Accessories",
    href: "/products?category=accessories",
    bg: "bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900",
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  return (
    <div className="relative overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`${slide.bg} transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg text-gray-300">{slide.subtitle}</p>
              <Link
                href={slide.href}
                className="mt-8 inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
