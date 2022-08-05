import { chromium } from "playwright";

export class AdsScraper {
  private readonly ADS_URL: string = "https://www.adsoftheworld.com/";
  public async scrape(): Promise<void> {
    const browser = await chromium.launch({
      headless: false,
      slowMo: 50,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(this.ADS_URL);

    const ads_div = await page.locator(
      "body > div.max-w-screen-2xl.mx-auto.bg-verylight.text-light.shadow-2xl > div.bg-verylight > div.grid.gap-6.xl\\:grid-cols-5.lg\\:grid-cols-4.md\\:grid-cols-3.sm\\:grid-cols-2.p-6.mx-auto > div"
    );
    const liItemCounter = await ads_div.count();
    for (let i = 0; i < liItemCounter; i++) {
      const current_add = ads_div.nth(i);

      const title_p = await current_add.locator(
        "div.px-4 > div.opensanssemibold.text-lg.leading-tight > a > p"
      );
      const title_text = await title_p.innerText();
      const image_div = await current_add.locator(
        "div.overflow-hidden > div > a > picture > source:nth-child(1)"
      );
      const image_url = await image_div.getAttribute("srcset");

      console.log(title_text);
      console.log(image_url);
    }

    //const ads_divs = await ads_div.$$("div");
    // ads_div.forEach((ad_div) => {
    //   ad_div.innerText().then((text) => {
    //     console.log(text);
    //   });
    // });
  }
}
