"use server";

import { scrapeAmazonProduct } from "../scrapper";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    // actual scraping
    const scrapeProduct = await scrapeAmazonProduct(productUrl);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
