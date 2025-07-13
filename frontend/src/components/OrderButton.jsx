import React from "react";
import { useNavigate } from "react-router-dom";

const OrderButton = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/order/${book._id}`, { state: { book } });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        📦 Request Book
      </button>
    </div>
  );
};

export default OrderButton;
