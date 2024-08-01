import Image from "next/image";
import React from 'react'
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
        <div className="flex flex-col cursor-pointer z-[50] items-center active:scale-95 justify-center pt-2 gap-y-20 pb-2 hover:opacity-90 transition">
            <Image src="/logo.png" alt="Logo" width={40} height={22} />
        </div>
    </Link>
  )
}

export default Logo