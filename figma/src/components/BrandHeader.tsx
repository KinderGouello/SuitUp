import { Sparkles } from 'lucide-react';

interface BrandHeaderProps {
  showTagline?: boolean;
}

export function BrandHeader({ showTagline = false }: BrandHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600 opacity-10 blur-3xl" />
      <div className="relative px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 blur-md opacity-50" />
            <Sparkles className="relative w-8 h-8 text-indigo-600 fill-indigo-600" />
          </div>
          <h1 className="text-3xl bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Suit Up!
          </h1>
        </div>
        {showTagline && (
          <p className="text-center text-sm text-gray-600">
            Your style, perfected daily ✨
          </p>
        )}
      </div>
    </div>
  );
}
