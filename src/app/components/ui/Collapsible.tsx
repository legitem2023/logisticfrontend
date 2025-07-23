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
    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-md overflow-hidden transition-all mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-gray-800 font-semibold text-base bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white rounded-t-2xl transition-colors duration-300"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp size={20} className="text-gray-600" />
        ) : (
          <ChevronDown size={20} className="text-gray-600" />
        )}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px] opacity-100 py-4 px-5" : "max-h-0 opacity-0 py-0 px-5"
        } overflow-hidden text-sm text-gray-700`}
      >
        {children}
      </div>
    </div>
  );
}
