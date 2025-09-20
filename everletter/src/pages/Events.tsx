const Events = () => {
  return (
    <div className="pb-16">
      <h2 className="text-2xl font-bold text-violet-800 mb-6">Events</h2>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-6">
          <button className="text-violet-600 font-bold">&lt;</button>
          <h3 className="text-lg font-semibold">August 2024</h3>
          <button className="text-violet-600 font-bold">S</button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-gray-500 text-sm font-medium">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center">
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
          {[8, 9, 10, 11, 12, 13, 14].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
          {[15, 16, 17, 18, 19, 20, 21].map(day => (
            <div key={day} className="p-2 relative">
              {day}
              {day === 16 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          ))}
          {[22, 23, 24, 25, 26, 27, 28].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
          {[29, 30, 31].map(day => (
            <div key={day} className="p-2 relative">
              {day}
              {day === 30 && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          ))}
          {Array(4).fill(0).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            <div>
              <h4 className="font-medium">John's Birthday</h4>
              <p className="text-gray-500 text-sm">August 16</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            <div>
              <h4 className="font-medium">Anniversary</h4>
              <p className="text-gray-500 text-sm">August 30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events