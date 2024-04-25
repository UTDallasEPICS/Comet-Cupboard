import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import "../styles/App.css";
import SearchBar from "./comp/SearchBar.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <SearchBar />
      </div>
    </>
  );
}

export default App;
