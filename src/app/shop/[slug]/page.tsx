import Head from "@/components/Head";
import DetailsChild from "@/components/details/detailsChild";
import RelatedProducts from "@/components/details/relatedProducts";
import { prisma } from "@/lib/prisma";

export default async function ProductDetails({params,}: {params: { slug: string };}) {
  const product = await prisma.product.findUnique({
    where: { id: params.slug },
  });

  if (!product) {
    return <div className="container text-center mt-5">Product not found</div>;
  }

  const relatedProducts = await prisma.product.findMany({
    where: { cateId: product.cateId, NOT: { id: product.id } },
    take: 8,
    include: { category: true },
  });

return (
    <>
        <Head title={product.name} />
        <DetailsChild product={product} />
        <RelatedProducts
            relatedProducts={relatedProducts.map((p) => ({
                ...p,
                productCate: p.category?.name || "Unknown",
                images: Array.isArray(p.images) ? p.images : [],
                salePrice: p.salePrice || 0, 
            }))}
        />


    </>
);
}
