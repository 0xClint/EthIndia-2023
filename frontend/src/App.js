
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Game } from "./pages";
import { Header } from "./components";


function App() {

  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/game" exact element={<Game />} />

        </Routes>
      </Router>
      {/* {chatBar && <ChatBox />} */}
    </div>
  );
}

export default App;