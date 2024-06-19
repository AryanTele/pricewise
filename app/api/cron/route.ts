import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { connectToDB } from "@/lib/scrapper/mongoose";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";

export async function GET() {
  try {
    connectToDB();

    const products = await Product.find({});
    if (!products) throw new Error("no products found");

    //1 Scrape latest product details and update db

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapeProduct = await scrapeAmazonProduct(currentProduct.url);
        if (!scrapeProduct) throw new Error("No product found");
        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapeProduct.currentPrice },
        ];
        const product = {
          ...scrapeProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: scrapeProduct.url,
          },
          product
        );

        //2. Check each products status
        const emailNotifType = getEmailNotifType(scrapeProduct, currentProduct);
      })
    );
  } catch (error) {
    throw new Error(`Error in GET: ${error}`);
  }
}
