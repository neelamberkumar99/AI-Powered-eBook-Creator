import React, { useEffect, useRef, useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-20 w-56 origin-top-right rounded-lg bg-white shoadow-lg border border-slate-200 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"

        >
            <div className="py-1" role="none">
                {children}
            </div>
        </div>
      )}
    </div>
  );
};
export const DropdownItem = ({ children, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center w-full px-4 py-2 text-sm  text-slate-700 hover:bg-slate-100 text-left"
            role="menuitem"
            tabIndex="-1"
        >
            {children}
        </button>
    );
};

export default Dropdown;