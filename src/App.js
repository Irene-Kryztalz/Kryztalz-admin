import React from 'react';
import { AppProvider } from "./Context";
import Index from "./pages/Index";

function App ()
{
  return (
    <AppProvider>
      <Index />
    </AppProvider>
  );
}

export default App;
