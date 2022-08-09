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

      const description_p = await current_add.locator(
        "div.px-4 > div:nth-child(1) > a"
      );
      const description_text = await description_p.innerText();

      const image_div = await current_add.locator(
        "div.overflow-hidden > div > a > picture > source:nth-child(1)"
      );
      const image_url = await image_div.getAttribute("srcset");

      const ad = this.convertScrapedDataToAd(
        title_text,
        description_text,
        image_url
      );

      console.log(ad);

      // TODO: Convert To AdModel
      // TODO: Insert to Database
    }
  }

  private convertScrapedDataToAd(
    title: string,
    company: string,
    imagePath: string
  ) {
    const screens = this.getRandomScreens();

    return {
      name: title,
      description: `An Ad by '${company}'`,
      image: imagePath,
      screens: screens,
      duration: Math.floor(Math.random() * 5),
    };
  }

  private getRandomScreens(): number[] {
    const NUMBER_OF_SCREENS = 5;
    const randomScreens = [];
    for (let index = 1; index < NUMBER_OF_SCREENS + 1; index++) {
      if (Math.random() > 0.7) {
        randomScreens.push(index);
      }
    }
    return randomScreens;
  }
}
