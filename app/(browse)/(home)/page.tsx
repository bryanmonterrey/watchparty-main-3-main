import { Results, ResultsSkeleton } from "./_components/results";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <div className="grid h-[calc(100%-30rem)] ">
      <div className="w-full grid grid-cols-12 -mx-2 -my-4 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 -space-x-24 2xl:grid-cols-12 pr-15 pl-14 gap-x-1 justify-center items-center">
        <div className="col-span-9 ml-10  h-[calc(100%-4rem)] rounded-lg aspect-video bg-bgblack ">
          
        </div>
        <div className="col-span-3 w-full h-[calc(100%-4rem)] rounded-lg bg-bgblack">
          
        </div>
      </div>
      </div>
      <div className="h-full py-4 px-7 mx-auto">
        <Suspense fallback={<ResultsSkeleton/>}>
        <Results />
        </Suspense>
      </div>
   </div>
  );
}

