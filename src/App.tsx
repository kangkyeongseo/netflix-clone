import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Routes/Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movieId" element={<Home />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
