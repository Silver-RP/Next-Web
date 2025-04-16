import { prisma } from "@/lib/prisma";
import CategorySwiper from "./CategorySwiper";

const CategoryCarousel = async () => {
  const categories = await prisma.category.findMany();

  const formattedCategories = categories.map(category => ({
    ...category,
    image: category.image ?? "/assets/images/default-category.png", 
  }));

  return (
    <section className="category-carousel container">
      <h2 className="section-title text-center mb-3 pb-xl-2 mb-xl-4">
        You Might Like
      </h2>

      <CategorySwiper categories={formattedCategories} /> 
    </section>
  );
};

export default CategoryCarousel;
