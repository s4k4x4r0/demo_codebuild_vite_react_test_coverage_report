import { useState } from "react";
import { sum } from "./sum";

export const CountButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => sum(count, 1))}>
      count is {count}
    </button>
  );
};
