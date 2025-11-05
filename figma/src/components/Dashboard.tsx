import { Cloud, Sun, CloudRain, Thermometer, Wind, Flame, Trophy, Zap, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { BrandHeader } from "./BrandHeader";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OutfitItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  location: string;
}

interface DashboardProps {
  onGenerateOutfit: () => void;
}

export function Dashboard({ onGenerateOutfit }: DashboardProps) {
  // Mock weather data
  const weather: WeatherData = {
    temp: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 12,
    location: "San Francisco, CA"
  };

  // Mock user stats
  const streak = 7;
  const styleScore = 92;
  const outfitsCreated = 24;

  // Daily motivation
  const motivations = [
    "You're killing it! 🔥",
    "Style icon in the making! ⭐",
    "Confidence looks good on you! 💫",
    "Ready to slay the day! 👑",
    "Your best look awaits! ✨"
  ];
  const dailyMotivation = motivations[new Date().getDay() % motivations.length];

  // Mock daily outfit suggestion
  const dailyOutfit: OutfitItem[] = [
    {
      id: "1",
      name: "White Cotton T-Shirt",
      image: "https://images.unsplash.com/photo-1648483098902-7af8f711498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzYyMjg1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Top"
    },
    {
      id: "2",
      name: "Blue Denim Jeans",
      image: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyMjA5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Bottom"
    },
    {
      id: "3",
      name: "White Sneakers",
      image: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzfGVufDF8fHx8MTc2MjE3NjI0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Shoes"
    }
  ];

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Cloud")) return <Cloud className="w-12 h-12" />;
    if (condition.includes("Rain")) return <CloudRain className="w-12 h-12" />;
    return <Sun className="w-12 h-12" />;
  };

  return (
    <div className="flex flex-col pb-20">
      {/* Brand Header */}
      <BrandHeader showTagline />

      <div className="flex flex-col gap-4 px-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <div className="text-2xl mb-1">{streak}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-2xl mb-1">{styleScore}</div>
              <div className="text-xs text-gray-600">Style Score</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">
                <Trophy className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl mb-1">{outfitsCreated}</div>
              <div className="text-xs text-gray-600">Outfits</div>
            </CardContent>
          </Card>
        </div>

        {/* Motivation Card */}
        <Card className="border-0 bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div>
                <p className="text-sm opacity-90">Daily Boost</p>
                <p className="text-lg">{dailyMotivation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Card */}
        <Card className="border-2 border-blue-100 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-1">{weather.location}</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </CardDescription>
              </div>
              <div className="text-blue-600">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-5xl">{weather.temp}°</span>
              <span className="text-xl text-gray-600">{weather.condition}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm">{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Wind className="w-4 h-4" />
                <span className="text-sm">{weather.wind} mph</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Outfit Suggestion */}
        <Card className="border-2 border-indigo-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Today's Perfect Match</CardTitle>
                <CardDescription>
                  Styled for {weather.temp}° and {weather.condition.toLowerCase()}
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-600 to-sky-500 border-0">
                AI Picked
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {dailyOutfit.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-purple-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-xs mb-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                      {item.category}
                    </Badge>
                    <p className="text-xs truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Style Match Score */}
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Style Match</span>
                <span className="text-sm">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Generate Outfit CTA */}
        <Card className="border-0 bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-xl shadow-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-1">Want a fresh look?</h3>
                <p className="text-sm text-white/90 mb-3">
                  Generate a new outfit based on today's weather and your style!
                </p>
                <Button
                  onClick={onGenerateOutfit}
                  className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Outfit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
