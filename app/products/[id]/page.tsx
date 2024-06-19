import { getProductByID } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductByID(id);
  if (!product) redirect("/");

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base opacity-50"
              >
                Visit product
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/red-heart.svg"
                alt="heart"
                width={20}
                height={20}
              />
              <p className="text-base font-semibold text-[#D46F77]"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
