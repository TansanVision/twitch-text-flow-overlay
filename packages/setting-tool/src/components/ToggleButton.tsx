// ToggleButton.tsx
import React, { useState } from "react";
import { css } from "@emotion/css";

type ToggleButtonProps = {
  checked?: boolean;
  onChange?: (value: boolean) => void;
};

const toggleRoot = css`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
`;

const toggleTrack = (on: boolean) => css`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${on ? "#4caf50" : "#ccc"};
  position: relative;
  transition: background 150ms ease-out;
`;

const toggleThumb = (on: boolean) => css`
  position: absolute;
  top: 2px;
  left: ${on ? "20px" : "2px"};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: left 150ms ease-out;
`;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked = false,
  onChange,
}) => {
  const [on, setOn] = useState(checked);

  const handleClick = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      className={toggleRoot}
      onClick={handleClick}
      aria-pressed={on}
    >
      <span className={toggleTrack(on)}>
        <span className={toggleThumb(on)} />
      </span>
    </button>
  );
};
