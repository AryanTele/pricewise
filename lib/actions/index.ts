"use server";

import { scrapeAmazonProduct } from "../scrapper";
import { connectToDB } from "../scrapper/mongoose";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    connectToDB();
    // actual scraping
    const scrapeProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapeProduct) return;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
