"use server"

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
  ) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;

  let subject = "";
  let body = "";

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
        <div>
          <h2>Welcome to MAScrape 🚀</h2>
          <p>You are now tracking <strong>${product.title}</strong> on Mighty Ape.</p>
          <p>Here’s a preview of the notifications you'll receive:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>Great news! The item <strong>${product.title}</strong> is now available for purchase on Mighty Ape.</p>
            <p>Act quickly - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
          </div>
          <p>Keep an eye out for more updates on <strong>${product.title}</strong> and any other items you’re tracking.</p>
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if(error) return console.log(error);
    
    console.log('Email sent: ', info);
  })
}