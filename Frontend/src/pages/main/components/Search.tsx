import React from 'react';

const Search = () => {
    return (
        <div className="flex items-center bg-black p-4 rounded-lg">
            <div className="flex items-center border border-white rounded-full">
                <div className="text-white mr-2 ml-3">🔎</div>
                <input
                    type="text"
                    placeholder="Search a course, topic, or material..."
                    className="bg-black text-white outline-none border-none rounded-full p-2"
                />
                <button className="ml-4 bg-white text-black rounded-full border border-white px-4 py-2 hover:bg-gray-200 transition">
                    Search
                </button>
            </div>
        </div>
    );
};

export default Search;