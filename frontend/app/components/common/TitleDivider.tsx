// components/TitleDivider.tsx

import React from 'react';

interface TitleDividerProps {
  title: string;
}

const TitleDivider: React.FC<TitleDividerProps> = ({ title }) => {
  return (
    <section className="mt-12">
      <div className="wrapper">
        <h2>{title}</h2>
      </div>
      <hr className="border-1 bg-black mb-4" />
    </section>
  );
};

export default TitleDivider;