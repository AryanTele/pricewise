"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { scrapeAmazonProduct } from "../scrapper";
import { connectToDB } from "../scrapper/mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    connectToDB();
    // actual scraping
    const scrapeProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapeProduct) return;

    let product = scrapeProduct;
    const existingProduct = await Product.findOne({ url: scrapeProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapeProduct.currentPrice },
      ];
      product = {
        ...scrapeProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapeProduct.url,
      },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductByID(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProduct() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProduct(productId: string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProduct = await Product.find({
      _id: { $ne: productId },
    }).limit(3);
    return similarProduct;
  } catch (error) {
    console.log(error);
  }
}
