import React from 'react'
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProductById, getSimilarProducts } from "@/lib/actions"
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { FaBookmark } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { formatNumber } from '@/lib/utils';
import { FaStar, FaCartPlus } from "react-icons/fa";
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/Modal';


type Props = {
  params: { id: string }
}



const page = async ({ params }: Props) => {
    const { id } = await params;
    const product: Product = await getProductById(id);
    
	if(!product) redirect('/')
	
	const similarProducts = await getSimilarProducts(id);


  return (
    <div className="product-container">
      	<div className="flex gap-10 xl:flex-row flex-col">
			<div className="product-image">
			<Image 
				src={product.images[0]}
				alt={product.title}
				width={580}
				height={400}
				className="mx-auto"
			/>
        	</div>
			<div className="flex-1 flex flex-col">
				<div className="flex justify-between items-start gap-5 flex-wrap pb-6">
					<div className="flex flex-col gap-3 w-[100%]">
						<p className="text-[28px] text-secondary font-semibold">
							{product.title}
						</p>
						<div className='flex flex-row items-center justify-between'>
							<Link
								href={product.url}
								target="_blank"
								className="text-base text-blue-500 opacity-50 underline hover:opacity-100"
							>
								Visit Product
							</Link>
							<div className="flex items-center gap-3">
								{product.availability ? (
									<div className="flex items-center gap-2 p-2 bg-green-200 rounded-10"> 
										<TiTick size={20}/>
										<span>In stock</span>
									</div>
									) : (
									<div className="flex items-center gap-2 p-2 bg-red-200 rounded-10"> 
										<ImCross size={20}/>
										<span>Out of stock</span>
									</div>
								)}

								<div className="p-2 bg-white-200 rounded-10">
									<FaBookmark size={20}/>
								</div>

								<div className="p-2 bg-white-200 rounded-10">
									<FaShare size={20}/>
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center flex-wrap justify-between gap-10 py-6 border-y border-y-[#E4E4E4]; w-[100%]">
						<div className="flex flex-col gap-2 justify-between">
							<p className="text-[34px] text-secondary font-bold">
								${formatNumber(product.price.salePrice)} {product.currency} 
							</p>
							{product.price.listPrice !== product.price.salePrice && (
								<p className="text-[20px] text-blue-500 font-bold">
									Was ${formatNumber(product.price.listPrice)} ({product.price.discountRate}% off)
								</p>
							)}
						</div>
						<div className="flex items-center gap-2 p-2 bg-yellow-200 rounded-10">
							<FaStar size={30}/>
							<span className='text-lg flex gap-2'>
								{product.ratingValue} 
								<Link
								href={`${product.url}/#reviews`}
								target="_blank"
								className=" text-blue-500 underline opacity-50 hover:opacity-100"
								>
									({product.ratingCount})
								</Link>
							</span>
						</div>							
					</div>
					<div className=" my-7 gap-5 grid grid-cols-2 w-[100%] mx-auto justify-items-center justify-center">
						<PriceInfoCard 
							title="Current Price"
							iconSrc="/assets/icons/price-tag.svg"
							value={`${product.currency} ${formatNumber(product.price.salePrice)}`}
						/>
						<PriceInfoCard 
							title="Average Price"
							iconSrc="/assets/icons/chart.svg"
							value={`${product.currency} ${formatNumber(product.price.averagePrice)}`}
						/>
						<PriceInfoCard 
							title="Highest Price"
							iconSrc="/assets/icons/arrow-up.svg"
							value={`${product.currency} ${formatNumber(product.price.highestPrice)}`}
						/>
						<PriceInfoCard 
							title="Lowest Price"
							iconSrc="/assets/icons/arrow-down.svg"
							value={`${product.currency} ${formatNumber(product.price.lowestPrice)}`}
						/>
					</div>
				</div>
				<Modal productId={id}/>
			</div>
        </div>

		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-5">
				<h3 className="text-2xl text-secondary font-semibold">
					Product Description
				</h3>

				<iframe
					srcDoc={product?.description}
					title="Product Description"
					style={{ width: '100%', border: 'none', height: '500px' }} 
					sandbox="allow-same-origin"
				/>
			</div>
		</div>
		{similarProducts && similarProducts?.length > 0 && (
        <div className="py-2 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>

          <div className="flex flex-wrap gap-10 mt-5 w-full">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
		


      </div>
  )
}

export default page