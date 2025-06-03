import React from "react";

const Blog = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-32 pb-16 px-4 lg:px-8">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Travel Blog</h1>
                    <p className="text-lg text-gray-600">Explore the latest travel insights and experiences.</p>
                </div>

                {/* Blog Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Blog Card 1 */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <img 
                            src="https://public.readdy.ai/ai/img_res/9f3034995335a10eb5edadda48d08dc4.jpg"
                            className="w-full h-[200px] object-cover"
                            alt="Maldives Luxury Resorts"
                        />
                        <div className="p-6">
                            <div className="text-sm text-gray-500 mb-2">February 25, 2025</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Ultimate Guide to Maldives Luxury Resorts</h3>
                            <p className="text-gray-600 mb-4">Discover the most exclusive overwater villas and underwater restaurants...</p>
                            <a href="#" className="text-blue-600 hover:text-blue-700">Read More →</a>
                        </div>
                    </div>

                    {/* Blog Card 2 */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <img 
                            src="https://public.readdy.ai/ai/img_res/f98643ff19e7b53b9f36ced32ab40cdc.jpg"
                            className="w-full h-[200px] object-cover"
                            alt="Safari Lodges in Africa"
                        />
                        <div className="p-6">
                            <div className="text-sm text-gray-500 mb-2">February 20, 2025</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Safari in Style: Luxury Lodges in Africa</h3>
                            <p className="text-gray-600 mb-4">Experience the wild in ultimate comfort with these exclusive safari lodges...</p>
                            <a href="#" className="text-blue-600 hover:text-blue-700">Read More →</a>
                        </div>
                    </div>

                    {/* Blog Card 3 */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <img 
                            src="https://public.readdy.ai/ai/img_res/22c187a662316443552f274af9965d73.jpg"
                            className="w-full h-[200px] object-cover"
                            alt="Mediterranean Yacht Adventures"
                        />
                        <div className="p-6">
                            <div className="text-sm text-gray-500 mb-2">February 15, 2025</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Mediterranean Yacht Adventures</h3>
                            <p className="text-gray-600 mb-4">Sail through the crystal-clear waters of the Mediterranean in style...</p>
                            <a href="#" className="text-blue-600 hover:text-blue-700">Read More →</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
