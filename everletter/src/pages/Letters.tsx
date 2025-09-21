const Letters = () => {
  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-violet-800 mb-6">Letters</h2>
      
      <div className="card mb-6">
        <div className="flex space-x-4 mb-6">
          <button className="btn btn-primary flex-1">Write a Letter</button>
          <button className="btn btn-outline flex-1">Schedule Letters</button>
        </div>
        
        <h3 className="text-lg font-semibold text-violet-800 mb-4">Sent Letters</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <div className="bg-violet-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-violet-700 font-semibold">L</span>
              </div>
              <div>
                <h4 className="font-medium">Luke Snyder</h4>
                <p className="text-sm text-gray-500">Thank you</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-3">Jun 5</span>
              <div className="h-5 w-5 rounded-full border-2 border-violet-600 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-violet-600"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-violet-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-violet-700 font-semibold">M</span>
              </div>
              <div>
                <h4 className="font-medium">Maria Lee</h4>
                <p className="text-sm text-gray-500">Miss you</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-3">May 22</span>
              <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Letters