import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Eye } from "lucide-react";

interface ClothingCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  season: string;
  color: string;
  onClick?: () => void;
}

export function ClothingCard({ name, image, category, season, color, onClick }: ClothingCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-100 transition-all border-2 border-indigo-50 hover:border-indigo-200 hover:-translate-y-1" 
      onClick={onClick}
    >
      <div className="relative aspect-square bg-gray-100 group">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all">
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white text-xs">
            <Eye className="w-3 h-3" />
            View Details
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex gap-1 mb-2">
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
            {category}
          </Badge>
          <Badge variant="outline" className="text-xs border-pink-200 text-pink-700">
            {season}
          </Badge>
        </div>
        <p className="truncate text-sm">{name}</p>
        <p className="text-xs text-gray-500 mt-1">{color}</p>
      </CardContent>
    </Card>
  );
}
