import CartButton from "../common/CartButton";

interface Product {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    images: string[];

  }
  
  interface Props {
    products: Product[];
    categoryName: string;
  }
  
  const CategoryProComponent = ({ products, categoryName }: Props) => {
    return (
      <div className="shop-list flex-grow-1">
       <h4 className="text-primary fw-bold border-bottom pb-2">Category: {categoryName}</h4>
        <div className="products-grid row row-cols-2 row-cols-md-3">
          {products.map((product) => (
            <div className="product-card-wrapper" key={product.id}>
              <div className="product-card mb-3">
                <div className="pc__img-wrapper">
                  <a href={`/shop/${product.id}`}>
                    <img
                      loading="lazy"
                       src={`/assets/app/images/products/${product.images[0]}`}
                      alt={product.name}
                      className="pc__img"
                      width="330"
                      height="360"
                      style={{ objectFit: "cover",
                        paddingRight:"100px"
                    }}
                    />
                  </a>
                  <CartButton productId={product.id}/>
                  
                </div>
  
                <div className="pc__info">
                  <h6 className="pc__title">
                    <a href={`/san-pham/${product.id}`}>{product.name}</a>
                  </h6>
                  <p className="product-card__price">
                    <span className="money text-red me-2">${product.salePrice}</span>
                    <del>${product.price}</del>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CategoryProComponent;
  