// components/SectionSendTo.tsx

import React from 'react';
import DropDownList from '../DropdownListForm'; // Adjust the path as necessary

const SectionSendTo: React.FC = () => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ]; // User list

  return (
    <section>
      <div className="wrapper">
        <div className="h-72 bg-red-200 rounded-lg p-4 mx-auto">
          <h3>Send to:</h3>
          <DropDownList onSubmit={(selection) => {}} />
        </div>
      </div>
    </section>
  );
};

export default SectionSendTo;