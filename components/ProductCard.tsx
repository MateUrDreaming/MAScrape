import { Product } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    product: Product;
}

const ProductCard = ({product} : Props) => {
  return (
    <div className='w-72 bg-white shadow-lg rounded-xl duration-500 hover:scale-105 hover:shadow-xl'>
        <Link href={`/products/${product._id}`} className="product-card">
        <Image 
        src={product.images[0]}
        alt={product.title}
        width={320}
        height={288}
        className="h-80 w-72 object-contain rounded-t-xl"
        />

        <div className="flex flex-col gap-3 px-3 py-3">
            <h3 className="text-lg font-bold text-black truncate block capitalize ">{product.title}</h3>

            <div className="flex justify-between">
            <p className="text-black opacity-50 text-lg capitalize">
                {product.availability ? 'In stock' : 'Out of stock'}
            </p>

            <p className="text-black text-lg font-semibold">
                <span>${product?.price.salePrice}</span>
            </p>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default ProductCard