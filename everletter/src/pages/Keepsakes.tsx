const Keepsakes = () => {
  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-violet-800 mb-6">Keepsakes</h2>
      <p className="text-gray-600 mb-6">A collection of cherished moments and memories</p>
      
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-violet-800 mb-4">I've Missed You</h3>
        <p className="text-gray-500 text-sm mb-4">June 15, 2024</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded border border-gray-300 mr-2"></div>
            <span className="text-gray-600 text-sm">Photos</span>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-violet-600 mr-2 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
            <span className="text-gray-600 text-sm">Letters</span>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-violet-600 mr-2 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
            <span className="text-gray-600 text-sm">Videos</span>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 rounded border border-gray-300 mr-2"></div>
            <span className="text-gray-600 text-sm">Voice Recordings</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-violet-800 mb-4">Memories</h3>
        
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="font-semibold">John's Graduation</h4>
            <p className="text-gray-500 text-sm">May 26, 2022</p>
          </div>
          
          <div className="pb-2">
            <h4 className="font-semibold">Our First Date</h4>
            <p className="text-gray-500 text-sm">March 8, 2023</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Keepsakes