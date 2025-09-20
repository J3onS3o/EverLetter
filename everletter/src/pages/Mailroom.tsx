const Mailroom = () => {
  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-violet-800 mb-6">Mailroom</h2>
      
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded border border-violet-600 mr-2"></div>
            <span className="text-violet-600">Search</span>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-violet-600 mr-2 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
            <span className="text-violet-600">Compose</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Anna</h3>
              <span className="text-sm text-gray-400">Jun 5</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Thinking of you</p>
          </div>
          
          <div className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Luke</h3>
              <span className="text-sm text-gray-400">May 22</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Thank you</p>
          </div>
          
          <div className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Maria</h3>
              <span className="text-sm text-gray-400">May 18</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Miss you</p>
          </div>
          
          <div className="pb-2">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">John</h3>
              <span className="text-sm text-gray-400">May 10</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Love this!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mailroom