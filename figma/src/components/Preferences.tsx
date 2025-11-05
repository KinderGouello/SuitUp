import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Bell, Palette, Sparkles, MapPin, Save, Crown } from "lucide-react";
import { Slider } from "./ui/slider";
import { toast } from "sonner@2.0.3";
import { Badge } from "./ui/badge";

export function Preferences() {
  const [preferences, setPreferences] = useState({
    // Profile
    name: "Alex Johnson",
    email: "alex@example.com",
    location: "San Francisco, CA",
    
    // Style Preferences
    stylePreference: "casual",
    colorPalette: "neutral",
    formality: [3],
    
    // Outfit Suggestions
    dailySuggestion: true,
    weatherBased: true,
    occasionBased: true,
    
    // Notifications
    notifications: true,
    outfitReminder: true,
    weatherAlerts: true
  });

  const handleSave = () => {
    toast.success("🎉 Preferences saved successfully!");
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Profile Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-3xl blur-2xl opacity-20" />
        <Card className="relative border-2 border-indigo-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-sky-500/10 rounded-full blur-2xl" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full blur-md opacity-30" />
                <Avatar className="w-20 h-20 ring-4 ring-white relative">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white">AJ</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full p-1">
                  <Crown className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  {preferences.name}
                </h1>
                <p className="text-sm text-gray-600">{preferences.email}</p>
                <Badge className="mt-2 bg-gradient-to-r from-indigo-600 to-sky-500 border-0 text-white">
                  Style Pro
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card className="border-2 border-indigo-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base">Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={preferences.name}
              onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
              className="border-indigo-200 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={preferences.email}
              onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
              className="border-indigo-200 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <Input
                id="location"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                className="pl-9 border-indigo-200 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style Preferences */}
      <Card className="border-2 border-indigo-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base">Style Preferences</CardTitle>
          </div>
          <CardDescription>Customize your outfit recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="style">Style Preference</Label>
            <Select
              value={preferences.stylePreference}
              onValueChange={(value) => setPreferences({ ...preferences, stylePreference: value })}
            >
              <SelectTrigger id="style" className="border-purple-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">🎯 Casual</SelectItem>
                <SelectItem value="business">💼 Business</SelectItem>
                <SelectItem value="sporty">⚡ Sporty</SelectItem>
                <SelectItem value="elegant">✨ Elegant</SelectItem>
                <SelectItem value="streetwear">🔥 Streetwear</SelectItem>
                <SelectItem value="minimalist">⚪ Minimalist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="palette">Color Palette</Label>
            <Select
              value={preferences.colorPalette}
              onValueChange={(value) => setPreferences({ ...preferences, colorPalette: value })}
            >
              <SelectTrigger id="palette" className="border-purple-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">⚪ Neutral Tones</SelectItem>
                <SelectItem value="bold">🌈 Bold Colors</SelectItem>
                <SelectItem value="pastel">🎨 Pastel Colors</SelectItem>
                <SelectItem value="monochrome">⬛ Monochrome</SelectItem>
                <SelectItem value="earth">🌿 Earth Tones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-3 block">Formality Level</Label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Casual</span>
              <Slider
                value={preferences.formality}
                onValueChange={(value) => setPreferences({ ...preferences, formality: value })}
                max={5}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">Formal</span>
            </div>
            <div className="mt-2 text-center">
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                Level {preferences.formality[0]} of 5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outfit Suggestions */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 fill-purple-600" />
            <CardTitle className="text-base">Outfit Suggestions</CardTitle>
          </div>
          <CardDescription>Control how outfits are suggested</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="daily" className="cursor-pointer">Daily Suggestion</Label>
              <p className="text-xs text-gray-500 mt-0.5">Get a fresh outfit every morning</p>
            </div>
            <Switch
              id="daily"
              checked={preferences.dailySuggestion}
              onCheckedChange={(checked) => setPreferences({ ...preferences, dailySuggestion: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="weather" className="cursor-pointer">Weather-Based</Label>
              <p className="text-xs text-gray-500 mt-0.5">Match outfits to weather conditions</p>
            </div>
            <Switch
              id="weather"
              checked={preferences.weatherBased}
              onCheckedChange={(checked) => setPreferences({ ...preferences, weatherBased: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="occasion" className="cursor-pointer">Occasion-Based</Label>
              <p className="text-xs text-gray-500 mt-0.5">Consider your calendar events</p>
            </div>
            <Switch
              id="occasion"
              checked={preferences.occasionBased}
              onCheckedChange={(checked) => setPreferences({ ...preferences, occasionBased: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="notifications" className="cursor-pointer">Enable Notifications</Label>
              <p className="text-xs text-gray-500 mt-0.5">Receive app notifications</p>
            </div>
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="reminder" className="cursor-pointer">Outfit Reminder</Label>
              <p className="text-xs text-gray-500 mt-0.5">Morning outfit notifications</p>
            </div>
            <Switch
              id="reminder"
              checked={preferences.outfitReminder}
              onCheckedChange={(checked) => setPreferences({ ...preferences, outfitReminder: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="alerts" className="cursor-pointer">Weather Alerts</Label>
              <p className="text-xs text-gray-500 mt-0.5">Get weather change alerts</p>
            </div>
            <Switch
              id="alerts"
              checked={preferences.weatherAlerts}
              onCheckedChange={(checked) => setPreferences({ ...preferences, weatherAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-200" 
        size="lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Preferences
      </Button>
    </div>
  );
}
