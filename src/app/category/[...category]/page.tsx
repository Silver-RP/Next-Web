import ShopSidebar from "@/components/shop/shop-sidebar";
import CategoryProComponent from "@/components/shop/category-pro";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { category: string[] } }) {
    const categorySlug = params.category?.[params.category.length - 1]; 

    const category = await prisma.category.findUnique({
        where: { slug: categorySlug }, 
    });

    if (!category) return notFound();

    const categoryProducts = await prisma.product.findMany({
        where: { cateId: category.id }, 
    });

    return (
        <section className="shop-main container d-flex pt-4 pt-xl-5">
            <ShopSidebar />
            <CategoryProComponent products={categoryProducts} categoryName={category.name} />
        </section>
    );
};


// export default CategoryPage;
