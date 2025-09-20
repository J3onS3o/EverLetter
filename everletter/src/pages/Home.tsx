const Home = () => {
  return (
    <div className="pb-16">
      <div className="text-center mb-10 mt-5">
        <h2 className="text-3xl font-bold text-violet-800 mb-2">Welcome to EverLetter</h2>
        <p className="text-gray-600">A place to cherish your letters and memories</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <button className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center h-24">
          <span className="text-2xl mb-2">✉️</span>
          <span className="text-sm font-medium">Write a Letter</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center h-24">
          <span className="text-2xl mb-2">📬</span>
          <span className="text-sm font-medium">View Mailroom</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center h-24">
          <span className="text-2xl mb-2">🎁</span>
          <span className="text-sm font-medium">View Keepsakes</span>
        </button>
        <button className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center h-24">
          <span className="text-2xl mb-2">📅</span>
          <span className="text-sm font-medium">Events</span>
        </button>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-violet-800 mb-4">Recent Letters</h3>
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
            <span className="text-sm text-gray-400">Jun 5</span>
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
            <span className="text-sm text-gray-400">May 22</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-violet-800 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-pink-700">🎂</span>
              </div>
              <div>
                <h4 className="font-medium">John's Birthday</h4>
                <p className="text-sm text-gray-500">Sep 10</p>
              </div>
            </div>
            <button className="text-violet-600 text-sm font-medium">Remind</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-700">💒</span>
              </div>
              <div>
                <h4 className="font-medium">Emma's Wedding</h4>
                <p className="text-sm text-gray-500">Aug 20</p>
              </div>
            </div>
            <button className="text-violet-600 text-sm font-medium">Remind</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home