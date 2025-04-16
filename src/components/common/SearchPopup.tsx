import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  link: string;
}

const SearchPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products?minimal=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API trả về dữ liệu không hợp lệ:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  }, []);

  if (!Array.isArray(products)) {
    console.error("Lỗi: products không phải mảng", products);
    return null;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      router.push(`/search?query=${searchTerm}`);
      setIsVisible(false); // 🔥 Đóng form sau khi tìm kiếm
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`header-tools__item hover-container ${isVisible ? "js-content_visible" : ""}`}>
      <div className="js-hover__open position-relative">
        <a
          className="js-search-popup search-field__actor"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(!isVisible);
          }}
        >
          <svg className="d-block" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <use href="#icon_search" />
          </svg>
        </a>
      </div>

      {isVisible && (
        <div className="search-popup js-hidden-content">
          <form className="search-field container" onSubmit={(e) => e.preventDefault()}>
            <p className="text-uppercase text-secondary fw-medium mb-4">What are you looking for?</p>
            <div className="position-relative">
              <input
                className="search-field__input search-popup__input w-100 fw-medium"
                type="text"
                name="search-keyword"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn-icon search-popup__submit" type="submit" onClick={handleSearch}>
                <svg className="d-block" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <use href="#icon_search" />
                </svg>
              </button>
            </div>

            {/* Kết quả tìm kiếm */}
            {searchTerm && (
              <div className="search-popup__results">
                {filteredProducts.length > 0 ? (
                  <ul className="sub-menu__list list-unstyled">
                    {filteredProducts.map((product) => (
                      <li key={product.id} className="sub-menu__item">
                        <a
                          href={`/shop/${product.id}`}
                          className="menu-link menu-link_us-s"
                          onClick={() => setIsVisible(false)} 
                        >
                          {product.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No results found.</p>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchPopup;
