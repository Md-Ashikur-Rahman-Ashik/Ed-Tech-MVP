"use client";

import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="flex items-center gap-2 text-sm text-secondary hover:text-danger transition-colors cursor-pointer"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </form>
  );
}
