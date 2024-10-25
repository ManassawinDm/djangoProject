import React from "react";

function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Discover Unique Art Toys
          </h1>
          <p className="text-xl mb-8">
            Handcrafted and limited edition collectibles for toy enthusiasts and
            collectors.
          </p>
          <button className="bg-white text-red-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
            Explore Collection
          </button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Art Toys
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={`src/image/picForNav.jpg`}
                alt={`Art Toy ${item}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Art Toy {item}</h3>
                <p className="text-gray-700 mb-4">
                  Limited edition handcrafted art toy, perfect for collectors.
                </p>
                <div class=" flex items-center justify-center">
                  <button class="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl group">
                    <span class="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                      <span class="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                    </span>
                    <span class="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                    <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                      View Details
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-red-100 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Become a Collector Today!</h2>
          <p className="text-lg mb-8">
            Join our community of toy enthusiasts and get exclusive access to
            new releases and events.
          </p>
          <button className="bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-red-700 transition duration-300">
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
