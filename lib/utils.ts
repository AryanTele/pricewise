export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = elements.text().trim();

    if (priceText) return priceText.replace(/\D/g, "");
    return "";
  }
}
