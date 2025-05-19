export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex gap-5 ">
          <div className=" size-28 bg-neutral-700" />
          <div className="flex flex-col gap-2 *:h-5 *:rounded-md">
            <div className="bg-neutral-700 w-80 " />
            <div className="bg-neutral-700 w-24" />
            <div className="bg-neutral-700 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
