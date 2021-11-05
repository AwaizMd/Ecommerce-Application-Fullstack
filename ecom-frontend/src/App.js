import React from "react";
import "./App.css";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import WebFont from "webfontloader";
import Home from './component/Home/Home.js'

function App() {
  
  React.useEffect(() => {
    WebFont.load({
      google: { families: ["Roboto", "Droid Sans"] },
    });
  }, []);

  return (
    <Router>
      <Header />
      <Home/>
      <Footer/>
    </Router>
  );
}

export default App;
