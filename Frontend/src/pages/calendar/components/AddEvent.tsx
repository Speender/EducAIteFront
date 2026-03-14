import React from 'react';


interface Props {
    onClick: () => void
}


const AddEvent = ({onClick}: Props) => {
    return (
        <button
            className="mt-4 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-300 transition"
            onClick={onClick}
        >
            ➕ Add Event
        </button>
    );
};

export default AddEvent;