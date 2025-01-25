import Home from "./components/pages/Home";
import { ThemeContextProvider } from "./components/context/ThemeContext";
import "./App.css";

const App = () => {
  return (
    <ThemeContextProvider>
      <Home />
    </ThemeContextProvider>
  );
};

export default App;
