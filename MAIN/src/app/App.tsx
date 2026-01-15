import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { MedicineMaster } from "./components/MedicineMaster";
import { Inventory } from "./components/Inventory";
import { PurchaseOrders } from "./components/PurchaseOrders";
import { Prescriptions } from "./components/Prescriptions";
import { Sales } from "./components/Sales";

function App() {
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <Dashboard />;
      case "medicines":
        return <MedicineMaster />;
      case "inventory":
        return <Inventory />;
      case "purchases":
        return <PurchaseOrders />;
      case "prescriptions":
        return <Prescriptions />;
      case "sales":
        return <Sales />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar tenantName="HealthCare Pharmacy - Main Branch" userName="Sarah Johnson" />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;
