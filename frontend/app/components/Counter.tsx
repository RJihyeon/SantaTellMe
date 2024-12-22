// components/Counter.tsx

import React, { useState } from 'react';
import Button from './Button';  // default import 방식으로 수정

interface CounterProps {
  initialCount: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="flex gap-8 py-6">
      <Button onClick={() => setCount(count - 1)}>-1</Button>
      <p className="text-3xl tabular-nums">{count}</p>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </div>
  );
};

export default Counter;
