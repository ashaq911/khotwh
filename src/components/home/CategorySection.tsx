import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Women",
    slug: "women",
    image: "/images/categories/women.jpg",
    description: "Elegant dresses, tops, and more",
  },
  {
    name: "Men",
    slug: "men",
    image: "/images/categories/men.jpg",
    description: "Sharp suits, casual wear, and accessories",
  },
  {
    name: "Kids",
    slug: "kids",
    image: "/images/categories/kids.jpg",
    description: "Fun and comfortable styles for children",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/images/categories/accessories.jpg",
    description: "Bags, jewelry, and more",
  },
]

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-lg font-bold">{cat.name}</h3>
              <p className="text-white/80 text-sm mt-1">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
