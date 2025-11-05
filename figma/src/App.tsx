import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Wardrobe } from "./components/Wardrobe";
import { AddItem } from "./components/AddItem";
import { Preferences } from "./components/Preferences";
import { OutfitGenerator } from "./components/OutfitGenerator";
import { Home, Shirt, Plus, Settings, Sparkles } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type TabType = "home" | "wardrobe" | "add" | "preferences";
type ViewType = "tabs" | "outfit-generator";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [activeView, setActiveView] = useState<ViewType>("tabs");

  const handleGenerateOutfit = () => {
    setActiveView("outfit-generator");
  };

  const handleBackToDashboard = () => {
    setActiveView("tabs");
    setActiveTab("home");
  };

  const renderContent = () => {
    if (activeView === "outfit-generator") {
      return <OutfitGenerator onBack={handleBackToDashboard} />;
    }

    switch (activeTab) {
      case "home":
        return <Dashboard onGenerateOutfit={handleGenerateOutfit} />;
      case "wardrobe":
        return <Wardrobe />;
      case "add":
        return <AddItem />;
      case "preferences":
        return <Preferences />;
      default:
        return <Dashboard onGenerateOutfit={handleGenerateOutfit} />;
    }
  };

  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "wardrobe" as TabType, label: "Closet", icon: Shirt },
    { id: "add" as TabType, label: "Add", icon: Plus },
    { id: "preferences" as TabType, label: "Profile", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-indigo-50">
      {/* Main Content */}
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl shadow-indigo-200/50 relative">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600" />
        
        {renderContent()}
      </main>

      {/* Bottom Navigation - Hide when in outfit generator */}
      {activeView === "tabs" && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t-2 border-indigo-100 shadow-2xl shadow-indigo-200/50">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-2xl" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-2xl blur-md opacity-50" />
                    </>
                  )}
                  
                  <div className="relative flex flex-col items-center gap-1">
                    {tab.id === "add" ? (
                      <div className={`${isActive ? '' : 'bg-gradient-to-r from-indigo-600 to-sky-500'} rounded-full p-2`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white'}`} />
                      </div>
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? '' : ''}`} />
                    )}
                    <span className="text-xs">{tab.label}</span>
                  </div>
                  
                  {isActive && tab.id !== "add" && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 fill-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
