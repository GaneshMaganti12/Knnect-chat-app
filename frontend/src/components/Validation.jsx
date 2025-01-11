import React from "react";
import { GoDotFill } from "react-icons/go";

function Validation({ validations }) {
  const validationList = [
    { name: "upper", label: "At least one uppercase letter" },
    { name: "lower", label: "At least one lowercase letter" },
    { name: "number", label: "At least one number (0-9)" },
    { name: "symbol", label: "At least one special character" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {validationList.map((item, index) => (
        <span key={index} className="flex items-center gap-3">
          <GoDotFill
            className={`${validations[item.name] && "text-green-600"}`}
          />
          <p
            className={`text-sm ${
              validations[item.name] && "text-green-600 font-medium"
            }`}
          >
            {item.label}
          </p>
        </span>
      ))}
    </div>
  );
}

export default Validation;
