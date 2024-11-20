import HeroCarousel from '@/components/HeroCarousel';
import Searchbar from '@/components/Searchbar';
import Image from 'next/image';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';


const page = async () => {

  const allProducts = await getAllProducts(); 

  return (
    <>
      <section className="px-6 md:px-20 py-24">
            <div className="flex max-xl:flex-col gap-16">
                <div className="flex flex-col justify-center">
                    <p className="small-text">
                        Fill your Mighty Ape cart smartly:
                        <FaArrowAltCircleRight size={16}/>
                    </p>
                    <h1 className='mt-4 text-6xl leading-[72px] font-bold tracking-[-1.2px] text-gray-900;'>
                        Harness MA<span className='text-primary'>Scrape</span> for mighty savings <br/>
                    </h1>
                    <p className='mt-6'>
                        Powerful, self-serve price tracking and analytics to help you save more, shop smarter, and stay ahead of the deals. MAScrape empowers you to convert your wishlist into savings, engage with personalized alerts, and grow savings on every purchase.
                    </p>
                    <Searchbar />
                </div>
                <HeroCarousel />
            </div>
        </section>
        <section className="trending-section">
        <h2 className="section-text">Popular Items</h2>

        <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default page