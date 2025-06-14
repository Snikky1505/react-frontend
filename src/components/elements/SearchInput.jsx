import { useState } from "react";

const SearchInput = ({ onHandleSearch }) => {
  const [username, setUsername] = useState(""); // Input value
  const [selectedOption, setSelectedOption] = useState("email"); // Default dropdown value
  const [isOpen, setIsOpen] = useState(false); // Untuk dropdown
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const options = [
    { value: "email", label: "Email" },
    { value: "username", label: "Username" },
    { value: "phone", label: "Phone" },
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await onHandleSearch({ option: selectedOption, username });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-3xl flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
      {/* Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-md h-10 hover:bg-gray-300 focus:outline-none"
        >
          {options.find((opt) => opt.value === selectedOption)?.label} ▼
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <ul className="py-2 text-gray-700">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    onClick={() => handleSelect(opt.value)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter search query..."
        className="flex-1 h-10 px-3 py-1 focus:outline-none text-gray-700"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className={`px-4 py-2 text-white rounded-r-md h-10 ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};

export default SearchInput;
