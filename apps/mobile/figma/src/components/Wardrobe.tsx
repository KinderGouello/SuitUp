import { useState } from "react";
import { ClothingCard } from "./ClothingCard";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface ClothingItem {
  id: string;
  name: string;
  image: string;
  labelImage: string;
  category: string;
  season: string;
  color: string;
  brand: string;
  size: string;
  material: string;
  notes: string;
}

interface WardrobeProps {
  onViewItem: (item: ClothingItem) => void;
}

export function Wardrobe({ onViewItem }: WardrobeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock wardrobe data
  const wardrobeItems: ClothingItem[] = [
    {
      id: "1",
      name: "White Cotton T-Shirt",
      image: "https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Top",
      season: "Summer",
      color: "White",
      brand: "Uniqlo",
      size: "M",
      material: "100% Cotton",
      notes: "Perfect for casual occasions"
    },
    {
      id: "2",
      name: "Blue Denim Jeans",
      image: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Bottom",
      season: "All Season",
      color: "Blue",
      brand: "Levi's",
      size: "32",
      material: "Denim",
      notes: "Classic slim fit"
    },
    {
      id: "3",
      name: "White Sneakers",
      image: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Shoes",
      season: "All Season",
      color: "White",
      brand: "Nike",
      size: "10",
      material: "Leather",
      notes: "Comfortable for daily wear"
    },
    {
      id: "4",
      name: "Floral Summer Dress",
      image: "https://images.unsplash.com/photo-1760124146284-0720713f0311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzYyMjAwODkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1760124146284-0720713f0311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzYyMjAwODkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Dress",
      season: "Summer",
      color: "Floral",
      brand: "Zara",
      size: "S",
      material: "Cotton blend",
      notes: "Great for outdoor events"
    },
    {
      id: "5",
      name: "Winter Puffer Jacket",
      image: "https://images.unsplash.com/photo-1551734412-cbc8e1904805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBjb2F0fGVufDF8fHx8MTc2MjI3NTMxOHww&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1551734412-cbc8e1904805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBjb2F0fGVufDF8fHx8MTc2MjI3NTMxOHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Outerwear",
      season: "Winter",
      color: "Navy",
      brand: "North Face",
      size: "L",
      material: "Polyester",
      notes: "Waterproof and warm"
    },
    {
      id: "6",
      name: "Black Leather Belt",
      image: "https://images.unsplash.com/photo-1672137233327-37b0c1049e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbG90aGluZyUyMHdhcmRyb2JlfGVufDF8fHx8MTc2MjI4NTUzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      labelImage: "https://images.unsplash.com/photo-1672137233327-37b0c1049e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbG90aGluZyUyMHdhcmRyb2JlfGVufDF8fHx8MTc2MjI4NTUzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Accessories",
      season: "All Season",
      color: "Black",
      brand: "Generic",
      size: "One Size",
      material: "Leather",
      notes: "Versatile accessory"
    }
  ];

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            My Collection
          </h1>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            {wardrobeItems.length} amazing pieces
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          <Input
            placeholder="Search your style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-indigo-200 focus:ring-indigo-500"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[120px] border-indigo-200">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-indigo-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="Top">Tops</SelectItem>
            <SelectItem value="Bottom">Bottoms</SelectItem>
            <SelectItem value="Dress">Dresses</SelectItem>
            <SelectItem value="Outerwear">Outerwear</SelectItem>
            <SelectItem value="Shoes">Shoes</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <ClothingCard
            key={item.id}
            {...item}
            onClick={() => onViewItem(item)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No items found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
