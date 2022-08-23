import { chromium } from "playwright";

export class NamesScraper {
  private readonly ADS_URL: string =
    "https://private.b144.co.il/PrivateResults.aspx?&p_name=%D7%99%D7%A2%D7%A7%D7%91&p_city=%D7%AA%D7%9C%20%D7%90%D7%91%D7%99%D7%91";
  public async scrape(): Promise<any> {
    const browser = await chromium.launch({
      headless: false,
      slowMo: 50,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const addresses = [];

    // Addresses
    await page.goto(this.ADS_URL);
    const cards_div = await page.locator(
      "#baseMasterContent_Content_ctl00_cardPlace > div"
    );
    const liItemCounter = await cards_div.count();
    for (let i = 0; i < liItemCounter; i++) {
      try {
        if (i == 4) {
          continue;
        }
        const current_add = cards_div.nth(i);
        const address = await current_add.locator(".location.ellipsis");
        const address_text = await address.innerText();
        addresses.push(address_text);
      } catch (e) {
        console.log(i + " probably ad");
      }
    }

    // Scrape Names

    const first_names: string[] = [];
    const last_names: string[] = [];
    await page.goto("https://fossbytes.com/tools/random-name-generator");
    const totalNamesToGenerate = await page.locator("#totalNames");
    await totalNamesToGenerate.fill(addresses.length.toString());

    while (true) {
      try {
        const submitButton1 = await page.locator(
          "//button[text()='Generate Names']"
        );
        await submitButton1.click();
        await page.waitForTimeout(3000);
        await page.waitForLoadState("networkidle");

        const names_div = await page.locator(
          "body > div.container-fluid.f-base-container > div.container-lg.content-container > div > div.main-tool > div.row > div > div.card > div.card-body > ul > li"
        );
        const namesItemCounter = await names_div.count();
        if (!namesItemCounter) {
          continue;
        }
        for (let i = 0; i < namesItemCounter; i++) {
          try {
            const current_name = names_div.nth(i);
            const full_name = await current_name.innerText();
            first_names.push(full_name.split(" ")[0]);
            last_names.push(full_name.split(" ")[1]);
          } catch (e) {}
        }
        break;
      } catch (e) {
        console.error(e);
        console.log("continueing");
        continue;
      }
    }

    const newUsers = addresses.map((current_address, i) => {
      const current_first_name = first_names[i];
      const current_last_name = last_names[i];
      const user = this.convertScrapedDataToUser(
        current_first_name,
        current_last_name,
        current_address
      );
      return user;
    });

    return newUsers;
  }

  private convertScrapedDataToUser(
    firstName: string,
    lastName: string,
    address: string
  ) {
    const password = this.getRandomPassword();

    return {
      firstName: firstName,
      lastName: lastName,
      email: `${firstName}.${lastName}@gmail.com`,
      password: password,
      address: address,
    };
  }

  private getRandomPassword(): string {
    const NUMBER_OF_CHARS = 9;
    let randomScreens = "";
    for (let index = 1; index < NUMBER_OF_CHARS + 1; index++) {
      randomScreens = randomScreens + Math.floor(Math.random() * 10);
    }
    return randomScreens;
  }
}
