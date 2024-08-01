import Image from "next/image";
import React from 'react'
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
    <div className="flex text-[#fff] flex-col cursor-pointer items-center justify-center pt-2 gap-y-20 pb-3 hover:opacity-90 transition">
        <Image src="/brbr.png" alt="Logo" width={150} height={200} />
        </div>
        </Link>
  )
}

export default Logo