"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: {
    products: number;
  };
}

export default function CategoryTable({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Deleted successfully!");
      router.refresh(); 
    } else {
      alert("Error deleting category");
    }
  };

  return (
    <div className="wg-table table-all-user">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="fs-5">#</th>
            <th className="fs-5">Name</th>
            <th className="fs-5">Slug</th>
            <th className="fs-5">Products</th>
            <th className="fs-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td className="pname">
                <div className="image">
                  <img
                    src={`/assets/app/images/home/demo3/${category.image}`}
                    alt={category.name}
                    className="image"
                  />
                </div>
                <div className="name">
                  <Link href="#" className="body-title-2">
                    {category.name}
                  </Link>
                </div>
              </td>
              <td>{category.slug}</td>
              <td>{category._count.products}</td>
              <td>
                <div className="list-icon-function">
                  <Link href={`/dashboard/categories/edit-category/${category.id}`}>
                    <div className="item edit">
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                  </Link>
                  <button className="item text-danger delete" onClick={() => handleDelete(category.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
