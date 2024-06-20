import Product from "@/lib/models/product.model";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { connectToDB } from "@/lib/scrapper/mongoose";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
            url: product.url,
          },
          product
        );

        //2. Check each products status
        const emailNotifType = getEmailNotifType(scrapeProduct, currentProduct);
        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET: ${error}`);
  }
}
