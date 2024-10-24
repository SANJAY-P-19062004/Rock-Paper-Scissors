import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import Result from './components/Result';
import PlayWithStranger from './components/PlayWithStranger';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
                <Route path="/result" element={<Result />} />
                <Route path='/playwithstranger' element={<PlayWithStranger />} />
            </Routes>
        </Router>
    );
};

export default App;
