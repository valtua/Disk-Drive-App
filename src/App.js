import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Routes/Home/Home';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="" element={<Home />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
