import { ModeToggle } from "./mode-toggle";
import { Heart } from "lucide-react";
import { SignInButton } from "./signin-button";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
              CauseDrop
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
