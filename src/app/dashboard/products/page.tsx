

import ProductList from "./ProductList";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string; sort?: string } }) {
    const params = await Promise.resolve(searchParams ?? {});
    const { page: pageStr = "1", sort: sortStr = "default" } = params;
    // const page = parseInt(searchParams.page || "1", 10);
    // const sort = searchParams.sort || "default";

    const page = parseInt(pageStr, 10);
    const sort = sortStr;

    const products = await prisma.product.findMany({
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
            name: sort === "name_asc" ? "asc" : sort === "name_desc" ? "desc" : undefined,
            price: sort === "price_asc" ? "asc" : sort === "price_desc" ? "desc" : undefined,
        },
        include: { category: true },
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / 10);

    return <ProductList initialProducts={products} totalPages={totalPages} />;
}
