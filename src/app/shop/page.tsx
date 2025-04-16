import ShopSidebar from "@/components/shop/shop-sidebar";
import ShopListSSR from "@/components/shop/shop-list-ssr";
import Head from "next/head";

export default function Shop({ searchParams }: { searchParams: { page?: string; sort?: string } }) {
  return (
    <>
      <Head>
        <title>Shop</title>
      </Head>
      <section className="shop-main container d-flex pt-4 pt-xl-5">
        <ShopSidebar />
        <ShopListSSR searchParams={searchParams} />
      </section>
    </>
  );
}
