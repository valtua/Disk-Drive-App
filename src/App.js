import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Routes/Home/Home';
import Disk from './Routes/Disk/Disk';
import File from './Routes/File/File';
import Profile from './Routes/Profile/Profile';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="/disk" element={<Disk />} />
                <Route path="/file" element={<File />} />
                <Route path="/profile" element={<Profile />} />
                
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
