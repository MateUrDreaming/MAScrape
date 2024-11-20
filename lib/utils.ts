import { PriceHistoryItem, Product } from "@/types";

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

export function extractDiscountRate(listPrice: number, salePrice: number) {
    return Math.floor(((listPrice - salePrice) / listPrice) * 100);
}

export function cleanPrice(price: string) {
    return parseFloat(price.replace(/[^\d.-]/g, ''));
}

export function checkAvaliability(availability: string) {
    return availability === "https://schema.org/InStock" ? true : false;
} 

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }

    return highestPrice.price;
}
  
export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }

    return lowestPrice.price;
}
  
export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;

    return averagePrice;
}

export const getEmailNotifType = (scrapedProduct: Product, currentProduct: Product) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);

    if (scrapedProduct.price.salePrice < lowestPrice) {
        return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    if (!scrapedProduct.availability && currentProduct.availability) {
        return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }
    if (scrapedProduct.price.discountRate >= THRESHOLD_PERCENTAGE) {
        return Notification.THRESHOLD_MET as keyof typeof Notification;
    }

    return null;
};


export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};