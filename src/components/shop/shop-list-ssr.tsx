import { prisma } from "@/lib/prisma";
import ProductList from "@/components/shop/shop-list";
import { notFound } from "next/navigation";

interface Product {
  id: string; 
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

const SORT_OPTIONS: Record<string, any> = {
  default: { id: "asc" },
  salePrice_asc: { salePrice: "asc" },
  salePrice_desc: { salePrice: "desc" },
  name_asc: { name: "asc" },
  name_desc: { name: "desc" },
};

async function fetchProducts(page: number, limit: number, sort: string) {
  const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.default;

  const totalProducts = await prisma.product.count();
  const prismaProducts = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy,
    select: {
      id: true,
      name: true,
      salePrice: true,
      price: true,
      images: true,
      category: { select: { name: true } },
    },
  });

  const products: Product[] = prismaProducts.map((p) => ({
    id: p.id,
    name: p.name,
    cateName: p.category.name,
    salePrice: p.salePrice ?? 0,
    price: p.price,
    images: p.images,
  }));
  

  return { products, totalProducts };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { page?: string; sort?: string };
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const { page: pageStr = "1", sort: sortStr = "default" } = params;
  
  const page = parseInt(pageStr, 10);
  const sort = sortStr;
  const limit = 12;

  const { products, totalProducts } = await fetchProducts(page, limit, sort);
  const totalPages = Math.ceil(totalProducts / limit);

  const pagination: PaginationProps = {
    currentPage: page,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: Math.max(1, page - 1),
    nextPage: Math.min(totalPages, page + 1),
  };

  return (
    <ProductList products={products} pagination={pagination} sort={sort} />
  );
}

