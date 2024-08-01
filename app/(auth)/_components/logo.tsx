import Image from "next/image";
import React from 'react'

const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-y-20 pb-5">
        <Image src="/ll.svg" alt="Logo" width={150} height={100} />
    </div>
  )
}

export default Logo