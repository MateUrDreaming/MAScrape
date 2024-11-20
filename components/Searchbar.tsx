"use client";

import { retrieveProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';

const validateAddress = (url : string) => { 
    try {
        return new URL(url).hostname.includes('mightyape');
    } catch {
        return false;
    }
}

const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isSearchQuery = validateAddress(searchPrompt);

        if(!isSearchQuery) return alert('Please provide a valid Mighty Ape link')
        
        try {
            setIsLoading(true);
            // Scrape the product page
            const product = await retrieveProduct(searchPrompt);
            router.push(`/products/${product}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };  


    return (
        <form 
            className="flex flex-wrap gap-4 mt-12"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Enter product link"
                className="flex-1 min-w-[200px] w-full p-3 border border-gray-300 rounded-lg shadow-xs text-base text-gray-500 focus:outline-none;"
                spellCheck="false" // Disables spell check to prevent hydration issues
            />
            <button
                type="submit"
                className="bg-gray-900 border border-gray-900 rounded-lg shadow-xs px-5 py-3 text-white text-base font-semibold hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40;"
                disabled={searchPrompt === ''}
            >
            {isLoading ? 'Searching...' : 'Search'}
            </button>
    </form>
    );
}

export default Searchbar