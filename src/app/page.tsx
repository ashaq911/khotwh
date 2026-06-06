import HeroBanner from "@/components/home/HeroBanner"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import PromotionBanner from "@/components/home/PromotionBanner"
import CategorySection from "@/components/home/CategorySection"
import BlogPosts from "@/components/home/BlogPosts"
import NewsletterSignup from "@/components/home/NewsletterSignup"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <PromotionBanner />
      <CategorySection />
      <BlogPosts />
      <NewsletterSignup />
    </>
  )
}
