"use client"

import qs from "query-string";
import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

import React from 'react'

const Search = () => {
    const router= useRouter();
    const [value, setValue] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!value) return;

        const url = qs.stringifyUrl({
            url: "/search",
            query: { term: value },
        }, { skipEmptyString: true});

        router.push(url);
    }

    const onClear = () => {
        setValue("");
        
    }

  return (
    <form
    onSubmit={onSubmit}
    className="w-full relative lg:w-[350px] justify-center flex items-center"> 
        <SearchIcon className="h-5 w-5 text-litepurp" strokeWidth={3}/>
        <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        className="rounded-r-none bg-transparent h-[34px] font-medium placeholder:font-medium text-white placeholder:text-litepurp pb-[9px] border-none text-[18px] focus-visible:ring-0 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        {value && (
            <X className="relative ml-3 h-[18px] w-[18px] text-white cursor-pointer hover:text-lightpurp transition"
            onClick={onClear} strokeWidth={3}/>
        )}
        
     </form>
  );
};

export default Search