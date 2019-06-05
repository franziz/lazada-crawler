const puppeteer = require("puppeteer-extra");
const puppeteerStealth = require("puppeteer-extra-plugin-stealth");
const ProxyChain = require("proxy-chain");

const ProductParser = require("./lib/parser/ProductParser");
const Humanizer = require("./lib/humanizer");

const CATEGORY_LINK = "https://www.lazada.sg/shop-mobiles/";

class Crawler{
  constructor(){
    puppeteer.use(puppeteerStealth());
  }

  /**
   * 
   * @param {String} categoryLink 
   */
  async crawl(categoryLink){
    const pageOptions = { timeout: 0, waitUntil: "networkidle0" }
    const proxyUrl = "http://127.0.0.1:8080";
    const anonymizeProxyUrl = await ProxyChain.anonymizeProxy(proxyUrl);

    const browser = await puppeteer.launch({ headless: false, slowMo: 500, args: [`--proxy-server=${anonymizeProxyUrl}`] });
    const page = await browser.newPage();
    await page.goto(categoryLink, pageOptions);
    
    const totalPages = await page.evaluate(() => {
      const { mainInfo } = window.pageData;
      const totalPages = parseInt(mainInfo.totalResults) / parseInt(mainInfo.pageSize);
      return Promise.resolve(totalPages);
    })
    
    const products = [];
    for(let pageNumber = 1; pageNumber <= totalPages; pageNumber++){
      const pageLink = `${categoryLink}?page=${pageNumber}`;
      await page.goto(pageLink, pageOptions);
      const pageProducts = await page.evaluate((productParserString, humanizerString) => {
        const productParser = new Function(`return ${productParserString}`)();
        const myHumanizer = new Function(`return ${humanizerString}`)();

        const { mods } = window.pageData;
        const { listItems } = mods;
        const products = listItems.map(item => productParser.parse(item));

        // Humanize scrolling
        return myHumanizer.mimicScrolling().then(() => {
          return Promise.resolve(products);
        })
      }, ProductParser.toString(), Humanizer.toString())
      products.push.apply(products, pageProducts);
    }
    console.log(products.length);
  }
}

const crawler = new Crawler();
crawler.crawl(CATEGORY_LINK);
