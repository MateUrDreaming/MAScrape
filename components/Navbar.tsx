import Image from 'next/image'
import Link from 'next/link'
import { FaSearchDollar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const navIcons = [
  { src: <FaSearchDollar size={24} />, alt: 'search' },
  { src: <FaHeart size={24}/>, alt: 'heart' },
  { src: <FaUser size={24}/>, alt: 'user' },
]

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image 
            src="/assets/icons/logo.svg"
            width={28}
            height={28}
            alt="logo"
          />

          <p className="nav-logo text-[1.2rem]">
            MA<span className='text-primary'>Scrape</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((Icon, idx) => (
            <span key={idx} aria-label={Icon.alt}>
              {Icon.src}
            </span>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar