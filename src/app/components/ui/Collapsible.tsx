import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border shadow-sm overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2 py-2 bg-gray-100 hover:bg-gray-200 transition"
      >
        <span className="font-medium text-left">{title}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out px-0 overflow-hidden ${
          open ? "max-h-screen py-0" : "max-h-0 py-0"
        }`}
      >
        <div className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
          {children}
        </div>
      </div>
    </div>
  );
}
