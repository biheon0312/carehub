import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Checkout from "./components/Checkout";
import Chatbot from "./components/Chatbot";
import Inventory from "./components/Inventory";
import AIConsult from "./components/AIConsult";
import PharmacyMap from "./components/PharmacyMap";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [highlightedMedicineId, setHighlightedMedicineId] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        setActiveView={setActiveView}
        setHighlightedMedicineId={setHighlightedMedicineId}
      />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="ml-64 pt-[73px] p-6 min-h-screen bg-gray-50">
        {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} />}
        {activeView === "checkout" && <Checkout />}
        {activeView === "inventory" && (
          <Inventory 
            highlightedMedicineId={highlightedMedicineId}
            setHighlightedMedicineId={setHighlightedMedicineId}
          />
        )}
        {activeView === "chatbot" && <AIConsult />}
        {activeView === "pharmacy-map" && <PharmacyMap />}
      </main>

      <Chatbot />
    </>
  );
}

export default App;