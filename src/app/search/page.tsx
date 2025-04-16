import ShopSidebar from "@/components/shop/shop-sidebar";
import SearchProComponent from "@/components/shop/search";
import { prisma } from "@/lib/prisma";

export default async function SearchPage({ searchParams }: { searchParams: { query?: string } }) {
    const query = searchParams.query || "";

    const products = await prisma.product.findMany({
      where: {
        name: { contains: query, mode: "insensitive" }, 
      },
      select: { id: true, name: true, price: true, salePrice: true, images: true },
    });

    return (
        <section className="shop-main container d-flex pt-4 pt-xl-5">
            <ShopSidebar />
            <SearchProComponent products={products} />
        </section>
    );
};
