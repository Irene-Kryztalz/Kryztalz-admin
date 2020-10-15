import React from 'react';
import { AppProvider } from "./Context";
import Index from "./pages/Index";
import "./App.css";

function App ()
{
  return (
    <AppProvider>
      <Index />
    </AppProvider>
  );
}

export default App;
