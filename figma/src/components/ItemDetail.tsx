import { ArrowLeft } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface ItemDetailProps {
  item: ClothingItem;
  onBack: () => void;
}

export function ItemDetail({ item, onBack }: ItemDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-indigo-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b-2 border-indigo-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-600" />
          </button>
          <div className="flex-1">
            <h1 className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Item Details
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">View your piece</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Item Name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100">
          <h2 className="text-xl mb-1">{item.name}</h2>
          <div className="flex gap-2 mt-3">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
              {item.category}
            </Badge>
            <Badge variant="outline" className="border-sky-300 text-sky-700">
              {item.season}
            </Badge>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-indigo-100">
            <p className="text-xs text-gray-500 mb-2">Item Photo</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 ring-2 ring-indigo-100">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-indigo-100">
            <p className="text-xs text-gray-500 mb-2">Label Photo</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 ring-2 ring-indigo-100">
              <ImageWithFallback
                src={item.labelImage}
                alt={`${item.name} label`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100">
          <h3 className="text-sm mb-3 text-gray-700">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Brand</p>
              <p className="text-sm">{item.brand}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Size</p>
              <p className="text-sm">{item.size}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Color</p>
              <p className="text-sm">{item.color}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Material</p>
              <p className="text-sm">{item.material}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100">
            <h3 className="text-sm mb-2 text-gray-700">Notes</h3>
            <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-3 rounded-xl border border-indigo-100">
              <p className="text-sm text-gray-700">{item.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white shadow-lg shadow-indigo-200/50"
            onClick={onBack}
          >
            Back to Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
