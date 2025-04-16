"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname(); 
  const pathSegments = pathname.split("/").filter((segment) => segment); 

  return (
    <nav className="breadcrumb">
      <ul className="breadcrumb__list">
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const url = "/" + pathSegments.slice(0, index + 1).join("/");

          return (
            <li key={url} className="breadcrumb__item">
              <span className="breadcrumb__separator"> / </span>
              <Link href={url} className="breadcrumb__link">
                {segment.charAt(0).toUpperCase() + segment.slice(1)} 
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
