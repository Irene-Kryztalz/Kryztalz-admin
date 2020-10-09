import React from 'react';
import { AppProvider } from "./Context";
import SignIn from "./pages/SignIn";
import "./App.css";

function App ()
{
  return (
    <AppProvider>
      <SignIn />
    </AppProvider>
  );
}

export default App;
