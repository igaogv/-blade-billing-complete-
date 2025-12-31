import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface User {
  name: string;
  photoUrl?: string;
}

interface NavbarProps {
  user: User | null;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onToggleSidebar }) => {
  return (
    <nav className="flex items-center px-4 h-16 bg-white shadow">
      <button onClick={onToggleSidebar} className="mr-4">
        {/* Ícone do menu ou sidebar */}
        <span>☰</span>
      </button>
      <div className="ml-auto flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user?.photoUrl} alt={user?.name} />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0) : "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
