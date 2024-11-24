import { h } from "preact";
import { useState } from "preact/hooks";

interface User {
  id: number;
  name: string;
}

interface SearchableDropdownProps {
  onSubmit: (userId: number) => void;
}

export default function SearchableDropdown({ onSubmit }: SearchableDropdownProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleInputChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    setQuery(target.value);

    if (target.value.length > 0) {
      try {
        const response = await fetch(`/api/search-users?query=${encodeURIComponent(target.value)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setUsers([]);
    }
  };

  const handleSelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    setSelectedUser(Number(target.value));
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (selectedUser !== null) {
      onSubmit(selectedUser);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users"
        list="user-options"
      />
      <datalist id="user-options">
        {users.map((user) => (
          <option key={user.id} value={user.name} />
        ))}
      </datalist>
      <button className={"bg-red-400"} type="submit">Send</button>
    </form>
  );
}