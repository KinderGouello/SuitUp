import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Camera, Upload, X, Check, Sparkles } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function AddItem() {
  const [itemPhoto, setItemPhoto] = useState<string | null>(null);
  const [labelPhoto, setLabelPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    season: "",
    color: "",
    brand: "",
    size: "",
    material: "",
    notes: ""
  });

  const handlePhotoUpload = (type: 'item' | 'label') => {
    // Simulate file upload - in production this would open file picker
    const mockImage = "https://images.unsplash.com/photo-1672137233327-37b0c1049e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbG90aGluZyUyMHdhcmRyb2JlfGVufDF8fHx8MTc2MjI4NTUzNHww&ixlib=rb-4.1.0&q=80&w=1080";
    if (type === 'item') {
      setItemPhoto(mockImage);
      toast.success("✨ Item photo added!");
    } else {
      setLabelPhoto(mockImage);
      toast.success("✨ Label photo added!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemPhoto || !labelPhoto) {
      toast.error("Please add both item and label photos");
      return;
    }

    if (!formData.name || !formData.category) {
      toast.error("Please fill in required fields");
      return;
    }

    // In production, this would save to database
    toast.success("🎉 Item added to your collection!");
    
    // Reset form
    setItemPhoto(null);
    setLabelPhoto(null);
    setFormData({
      name: "",
      category: "",
      season: "",
      color: "",
      brand: "",
      size: "",
      material: "",
      notes: ""
    });
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl mb-1 bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
          Add New Item
        </h1>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Expand your style collection
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload Section */}
        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
            <CardDescription>Add at least 2 photos: item and label</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Item Photo */}
            <div>
              <Label>Item Photo *</Label>
              <div 
                onClick={() => handlePhotoUpload('item')}
                className="mt-2 aspect-square border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all bg-indigo-50/30"
              >
                {itemPhoto ? (
                  <div className="relative w-full h-full">
                    <img src={itemPhoto} alt="Item" className="w-full h-full object-cover rounded-2xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemPhoto(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full p-3 mb-3">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-indigo-600">Tap to add photo</p>
                    <p className="text-xs text-gray-500 mt-1">Show off your item</p>
                  </>
                )}
              </div>
            </div>

            {/* Label Photo */}
            <div>
              <Label>Label Photo *</Label>
              <div 
                onClick={() => handlePhotoUpload('label')}
                className="mt-2 aspect-square border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all bg-indigo-50/30"
              >
                {labelPhoto ? (
                  <div className="relative w-full h-full">
                    <img src={labelPhoto} alt="Label" className="w-full h-full object-cover rounded-2xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLabelPhoto(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full p-3 mb-3">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-indigo-600">Tap to add label</p>
                    <p className="text-xs text-gray-500 mt-1">Capture care details</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., White Cotton T-Shirt"
                className="border-indigo-200 focus:ring-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category" className="border-indigo-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Bottom">Bottom</SelectItem>
                  <SelectItem value="Dress">Dress</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Shoes">Shoes</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="season">Season</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData({ ...formData, season: value })}>
                  <SelectTrigger id="season" className="border-indigo-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                    <SelectItem value="All Season">All Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g., White"
                  className="border-indigo-200 focus:ring-indigo-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-base">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g., Nike"
                  className="border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., M"
                  className="border-indigo-200 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g., 100% Cotton"
                className="border-indigo-200 focus:ring-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes about this item..."
                rows={3}
                className="border-indigo-200 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white border-0 shadow-lg shadow-indigo-200" 
          size="lg"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Add to Collection
        </Button>
      </form>
    </div>
  );
}
