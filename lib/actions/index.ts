"use server";

import { revalidatePath } from 'next/cache';
import Product from '../models/product.model';
import { connectToDB } from '../mongoose';
import { scrapeProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { User } from '@/types';
import { generateEmailBody, sendEmail } from '../nodemailer';

export async function retrieveProduct(url: string) {
    if (!url) return;

    try {
        connectToDB();

        const response = await scrapeProduct(url);
        if (!response)  return;

        let product = response;

        const existing = await Product.findOne({url: product.url});

        if (existing) { 
            const updatedProductPriceHistory: any = [
                ...existing.priceHistory, 
                {price: product.price.salePrice}
            ];
            
            product = { 
                ...product, 
                priceHistory: updatedProductPriceHistory,
                price: { 
                    ...product.price,
                    lowestPrice: getLowestPrice(updatedProductPriceHistory),
                    highestPrice: getHighestPrice(updatedProductPriceHistory),
                    averagePrice: getAveragePrice(updatedProductPriceHistory),
                }
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            {url: product.url},
            product,
            {new: true, upsert: true},
        );

        revalidatePath(`products/${newProduct?._id}`);
        return `${newProduct?._id}`;
    } catch (error: any) {
        throw new Error(`Failed to retrieve product: ${error}`);
    }
}

export async function getProductById(productId: string) {
    try {
      connectToDB();
  
      const product = await Product.findOne({ _id: productId });
  
      if(!product) return null;
  
      return product;
    } catch (error) {
      console.log(error);
    } 
}


export async function getAllProducts() {
    try { 
        connectToDB();
  
        const products = await Product.find();
  
        if(!products) return null;
  
        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string) {
    try {
      connectToDB();
  
      const currentProduct = await Product.findById(productId);
  
      if(!currentProduct) return null;
  
      const similarProducts = await Product.find({
        _id: { $ne: productId },
      }).limit(4);
  
      return similarProducts;
    } catch (error) {
      console.log(error);
    }
}


export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);
    
        if(!product) return;
    
        const userExists = product.users.some((user: User) => user.email === userEmail);
    
        if(!userExists) {
          product.users.push({ email: userEmail });
    
          await product.save();
    
          const emailContent = await generateEmailBody(product, "WELCOME");
    
          await sendEmail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.log(error);
    }
}