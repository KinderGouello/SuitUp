import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Sparkles, RefreshCw, Trash2, Check } from 'lucide-react';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
  reason: string;
}

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface OutfitGeneratorProps {
  onBack: () => void;
}

export function OutfitGenerator({ onBack }: OutfitGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedItemToSwap, setSelectedItemToSwap] =
    useState<OutfitItem | null>(null);

  // Mock outfit items
  const [outfit, setOutfit] = useState<OutfitItem[]>([
    {
      id: '1',
      name: 'White Cotton T-Shirt',
      image:
        'https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Top',
      reason: 'Light & breathable for 22° weather',
    },
    {
      id: '2',
      name: 'Blue Denim Jeans',
      image:
        'https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bottom',
      reason: 'Versatile for partly cloudy conditions',
    },
    {
      id: '3',
      name: 'White Sneakers',
      image:
        'https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Shoes',
      reason: 'Comfortable & matches your casual style',
    },
  ]);

  // Mock alternative items for swapping
  const alternativeItems: { [key: string]: WardrobeItem[] } = {
    Top: [
      {
        id: 'alt-1',
        name: 'Black T-Shirt',
        image:
          'https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Top',
      },
      {
        id: 'alt-2',
        name: 'Gray Polo Shirt',
        image:
          'https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Top',
      },
    ],
    Bottom: [
      {
        id: 'alt-3',
        name: 'Black Chinos',
        image:
          'https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Bottom',
      },
      {
        id: 'alt-4',
        name: 'Khaki Shorts',
        image:
          'https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Bottom',
      },
    ],
    Shoes: [
      {
        id: 'alt-5',
        name: 'Brown Loafers',
        image:
          'https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Shoes',
      },
      {
        id: 'alt-6',
        name: 'Black Boots',
        image:
          'https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Shoes',
      },
    ],
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      toast.success('✨ Your perfect outfit is ready!');
    }, 2000);
  };

  const handleSwapItem = (item: WardrobeItem) => {
    if (!selectedItemToSwap) return;

    const newOutfit = outfit.map((outfitItem) =>
      outfitItem.id === selectedItemToSwap.id
        ? {
            ...item,
            reason: 'Swapped by you - great choice!',
          }
        : outfitItem
    );

    setOutfit(newOutfit);
    setSelectedItemToSwap(null);
    toast.success(`✨ Swapped to ${item.name}!`);
  };

  const handleLaundryBasket = (item: OutfitItem) => {
    // Auto-select a random alternative
    const alternatives = alternativeItems[item.category] || [];
    if (alternatives.length > 0) {
      const randomAlt =
        alternatives[Math.floor(Math.random() * alternatives.length)];
      const newOutfit = outfit.map((outfitItem) =>
        outfitItem.id === item.id
          ? {
              ...randomAlt,
              reason: 'Auto-picked (original in laundry)',
            }
          : outfitItem
      );

      setOutfit(newOutfit);
      toast.success(
        `🧺 ${item.name} marked as in laundry. Auto-selected ${randomAlt.name}!`
      );
    }
  };

  if (!hasGenerated) {
    return (
      <div className="flex flex-col pb-20 min-h-screen">
        {/* Header */}
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Generation Card */}
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="border-2 border-purple-100 w-full max-w-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-white fill-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Ready to Suit Up?
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Let AI create your perfect outfit based on today's weather and
                your style preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Analyzing your wardrobe...</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
              ) : (
                <Button
                  onClick={handleGenerate}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-200"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Outfit
                </Button>
              )}

              <div className="text-center text-xs text-gray-500 pt-2">
                Based on 22° • Partly Cloudy • Casual Style
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="p-4 border-b border-purple-100">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Today's Outfit
            </h1>
            <p className="text-sm text-gray-600">Tuesday, November 4</p>
          </div>
          <Button
            onClick={handleGenerate}
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Style Match Score */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Style Match</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 border-0">
                Perfect Match
              </Badge>
            </div>
            <Progress value={95} className="h-2 mb-2" />
            <p className="text-xs text-gray-600">
              This outfit perfectly matches your preferences and the weather!
            </p>
          </CardContent>
        </Card>

        {/* Outfit Items */}
        <div className="space-y-3">
          {outfit.map((item) => (
            <Card
              key={item.id}
              className="border-2 border-purple-100 overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-purple-100 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-purple-100 text-purple-700 mb-1"
                        >
                          {item.category}
                        </Badge>
                        <h3 className="truncate">{item.name}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 flex items-start gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{item.reason}</span>
                    </p>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedItemToSwap(item)}
                        variant="outline"
                        size="sm"
                        className="text-xs border-purple-200 hover:bg-purple-50"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Swap
                      </Button>
                      <Button
                        onClick={() => handleLaundryBasket(item)}
                        variant="outline"
                        size="sm"
                        className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        In Laundry
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-200"
          size="lg"
        >
          <Check className="w-4 h-4 mr-2" />
          Love It! Suit Up
        </Button>
      </div>

      {/* Swap Item Dialog */}
      <Dialog
        open={!!selectedItemToSwap}
        onOpenChange={() => setSelectedItemToSwap(null)}
      >
        <DialogContent className="max-w-md">
          {selectedItemToSwap && (
            <>
              <DialogHeader>
                <DialogTitle>Swap {selectedItemToSwap.category}</DialogTitle>
                <DialogDescription>
                  Choose an alternative from your wardrobe
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3">
                {(alternativeItems[selectedItemToSwap.category] || []).map(
                  (altItem) => (
                    <button
                      key={altItem.id}
                      onClick={() => handleSwapItem(altItem)}
                      className="group relative rounded-xl overflow-hidden border-2 border-purple-100 hover:border-purple-400 transition-all hover:shadow-lg"
                    >
                      <div className="aspect-square bg-gray-100">
                        <ImageWithFallback
                          src={altItem.image}
                          alt={altItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs truncate">
                            {altItem.name}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs truncate">{altItem.name}</p>
                      </div>
                    </button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setSelectedItemToSwap(null)}
                className="w-full border-purple-200 hover:bg-purple-50"
              >
                Cancel
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
