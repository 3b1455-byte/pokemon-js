import React from "react";
import styled from "styled-components";
import Gameboy from "./components/Gameboy";
import Game from "./components/Game";

import "./App.css";
import Paint from "./components/Paint";
import { PAINT_MODE } from "./app/constants";

const StyledApp = styled.div`
  background: black;
  width: 100vw;
  height: 100dvh;
  display: flex;
  flex-direction: column; /* Changed to stack Gameboy and Backup bar vertically */
  justify-content: center;
  align-items: center;
  padding: 5px;
  padding-bottom: 28px;

  @media (min-width: 1000px) {
    padding: 5px;
  }
`;

const App = () => {
  // --- BACKUP LOGIC FOR IOS SAFARI STORAGE FIX ---
  const exportSaveFile = () => {
    const backupData: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) backupData[key] = localStorage.getItem(key);
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokemon_js_save_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSaveFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        Object.keys(backupData).forEach((key) => {
          if (backupData[key]) {
            localStorage.setItem(key, backupData[key]);
          }
        });
        alert("Save imported successfully! Reloading to apply your progress...");
        window.location.reload();
      } catch (err) {
        alert("Failed to parse file. Make sure it's a valid Pokemon JS JSON save.");
      }
    };
    reader.readAsText(file);
  };
  // --- END OF BACKUP LOGIC ---

  return (
    <StyledApp>
      <Gameboy>
        <Game />
        {PAINT_MODE && <Paint />}
      </Gameboy>

      {/* --- BACKUP BUTTON INTERFACE --- */}
      <div style={{ 
        marginTop: "15px",
        padding: "10px", 
        textAlign: "center", 
        display: "flex", 
        gap: "12px", 
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        fontSize: "12px",
        zIndex: 9999
      }}>
        <button 
          onClick={exportSaveFile} 
          style={{ padding: "8px 12px", background: "#3182ce", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          💾 Backup Save
        </button>
        
        <label style={{ padding: "8px 12px", background: "#48bb78", color: "white", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          📂 Load Backup
          <input 
            type="file" 
            accept=".json" 
            onChange={importSaveFile} 
            style={{ display: "none" }} 
          />
        </label>
      </div>
    </StyledApp>
  );
};

export default App;
