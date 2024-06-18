import { Product } from "@/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3>{product.title}</h3>
      </div>
    </Link>
  );
};

export default ProductCard;
