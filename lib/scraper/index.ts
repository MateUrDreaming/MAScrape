import axios from "axios";
import * as cheerio from "cheerio";
import { extractDiscountRate, cleanPrice, checkAvaliability } from "../utils";

export async function scrapeProduct(url: string) {
    if (!url) return;


    const username = String(process.env.BD_USERNAME);
    const password = String(process.env.BD_PASSWORD);
    const port = 22225;
    const session_id = (Math.random() * 100000).toFixed(0);

    // Configure the proxy options
    const options = {
        auth: {
          username: `${username}-session-${session_id}`,
          password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
      }

    try {
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);
        
        const images: any = [];

        $('.flex.h-full.touch-pan-y.touch-pinch-zoom > div.size-full.flex-shrink-0.justify-center.self-stretch').each(function(this: any) {
        const imgSrc = $(this).find('button.size-full img').attr('src'); 
        if (imgSrc) {
            images.push(imgSrc);
        }
        });       

        //Found that Mightyape stores all data in a json object. 
        const jsonData = $('script[type="application/ld+json"]').html();
        if (!jsonData) {
            throw new Error('No JSON data found');
        }
        const productData = JSON.parse(jsonData);

        let listPrice = $('.text-body-md.font-body-high-emphasis').text().trim().substring(1) || productData.offers.price;
        let salePrice = productData.offers.price;

        const discountRate = extractDiscountRate(cleanPrice(listPrice), cleanPrice(productData.offers.price));

        const availability = checkAvaliability(productData.offers.availability);   
        
        if (!productData.aggregateRating) {
            productData.aggregateRating = {};
        }
        
        if (!productData.aggregateRating.ratingValue) {
            productData.aggregateRating.ratingValue = 0;
        }
        
        if (!productData.aggregateRating.reviewCount) {
            productData.aggregateRating.reviewCount = 0;
        }
        

        const data = {
            url,
            title: productData.name,
            sku: productData.sku,
            gtin: productData.gtin,
            priceHistory: [],
            price: { 
                listPrice: Number(listPrice) || Number(salePrice),
                salePrice: Number(salePrice) || Number(listPrice),
                discountRate: discountRate,
                lowestPrice: Number(salePrice) || Number(listPrice),
                highestPrice: Number(listPrice) || Number(salePrice),
                averagePrice: Number(salePrice) || Number(listPrice),
            },
            availability: availability,
            images: images,
            currency: productData.offers.priceCurrency,
            ratingValue: productData.aggregateRating.ratingValue,
            ratingCount: productData.aggregateRating.reviewCount,
            description: productData.description,
            brand: productData.brand.name || "Mighty Ape",
        };
      
        return data;

    } catch (error:any) {
        console.error('Error:', error.message);
    }
}