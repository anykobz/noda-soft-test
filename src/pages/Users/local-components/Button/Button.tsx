import React from "react";
export interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({ onClick }: IButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
};

export default Button;
