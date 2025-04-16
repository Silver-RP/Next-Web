import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryTable from "./CategoryTable"; 

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
          <h3>Categories</h3>
          <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
            <li>
              <Link href="/dashboard">
                <div className="text-tiny">Dashboard</div>
              </Link>
            </li>
            <li>▸</li>
            <li>
              <div className="text-tiny">Categories</div>
            </li>
          </ul>
        </div>

        <div className="wg-box">
          <div className="flex items-center justify-between gap10 flex-wrap">
            <div className="wg-filter flex-grow">
              <form className="form-search">
                <fieldset className="name">
                  <input type="text" placeholder="Search here..." required />
                </fieldset>
                <div className="button-submit">
                  <button type="submit">
                    <i className="icon-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <Link className="tf-button style-1 w208" href="/dashboard/categories/add-category">
              <i className="icon-plus"></i>Add new
            </Link>
          </div>

          <CategoryTable categories={categories} />

          <div className="divider"></div>
          <div className="flex items-center justify-between flex-wrap gap10 wgp-pagination"></div>
        </div>
      </div>
    </div>
  );
}
