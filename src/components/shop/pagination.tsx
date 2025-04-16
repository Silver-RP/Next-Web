"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  sort: string; 
}

export default function Pagination({ currentPage, totalPages, sort }: PaginationProps) {
  return (
    <div className="pagination">
      <ul className="pagination-list">
        <li className={currentPage === 1 ? "disabled" : ""}>
          {currentPage > 1 ? (
            <Link href={`/shop?page=${currentPage - 1}&sort=${sort}`}>&laquo; Prev</Link>
          ) : (
            <span>&laquo; Prev</span>
          )}
        </li>

        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={currentPage === i + 1 ? "active" : ""}>
            <Link href={`/shop?page=${i + 1}&sort=${sort}`}>{i + 1}</Link>
          </li>
        ))}

        <li className={currentPage === totalPages ? "disabled" : ""}>
          {currentPage < totalPages ? (
            <Link href={`/shop?page=${currentPage + 1}&sort=${sort}`}>Next &raquo;</Link>
          ) : (
            <span>Next &raquo;</span>
          )}
        </li>
      </ul>
    </div>
  );
}
