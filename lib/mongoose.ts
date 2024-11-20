import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) console.log('MongoDB URI is not defined');
    
    if(isConnected) console.log('Using existing database connection');
        
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = true;
        console.log('Database connection established');

    } catch (error) {   
        console.log('Database connection failed: ', error);
    }
}