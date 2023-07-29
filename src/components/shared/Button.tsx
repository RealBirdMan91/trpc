import clsx from "clsx";
import React from "react";

type Button = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface ButtonProps extends Button {
  small?: boolean;
  gray?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  small = false,
  gray = false,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "rounded-full text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        small ? "px-2 py-1" : "front-bold px-4 py-2",
        gray
          ? "bg-gray-400 hover:bg-gray-300 focus:bg-gray-300"
          : "bg-blue-500 hover:bg-blue-400 focus:bg-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
