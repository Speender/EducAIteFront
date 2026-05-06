interface AnalyticsHeaderProps {
  studentFirstName?: string;
}

const AnalyticsHeader = ({ studentFirstName }: AnalyticsHeaderProps) => {
  return (
    <div className="flex w-full items-center bg-black py-8 text-white">
  
      <div className="ml-16 flex min-w-0 flex-col">
        <h1 className="whitespace-nowrap text-4xl font-bold">
          Hey, <span className="text-[#00CEC8]">{studentFirstName || 'Student'}</span>
        </h1>
        <p className="mt-1 whitespace-nowrap text-lg text-white/40">
          Here is your latest persisted learning snapshot.
        </p>
      </div>
    </div>
  )
}

export default AnalyticsHeader
