export type PriceHistoryItem = {
    price: number;
};

export type User = {
    email: string;
};

export type Product = {
    _id?: string;
    url: string;
    title: string;
    sku: string;
    gtin: string;
    priceHistory: PriceHistoryItem[] | [];
    price: price;
    description: string;
    availability: Boolean;
    images: string[];
    users?: User[];
    currency: string;
    ratingValue: number;
    ratingCount: number;
    brand: string;
};


export type price = {
    listPrice: number;
    salePrice: number;
    discountRate: number;
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
};

export type NotificationType =
    | "WELCOME"
    | "CHANGE_OF_STOCK"
    | "LOWEST_PRICE"
    | "THRESHOLD_MET";

export type EmailContent = {
    subject: string;
    body: string;
};

export type EmailProductInfo = {
    title: string;
    url: string;
};