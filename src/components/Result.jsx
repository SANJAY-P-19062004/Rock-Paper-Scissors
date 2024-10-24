import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Result = () => {
    const { state } = useLocation(); // Get state from navigation
    const { message } = state || { message: "No result" }; // Default message if no state
    const navigate = useNavigate(); // Use navigate to programmatically change routes

    // Function to navigate to the Game page for "Play Again"
    const handlePlayAgain = () => {
        navigate('/game'); // Assuming '/game' is your game route
    };

    // Function to navigate to the Home/Play with Computer page
    const handleGoHome = () => {
        navigate('/'); // Assuming '/home' is your home route
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-800 space-y-6">
            <h1 className="text-white text-7xl mb-6">{message}</h1>
            <div className="flex space-x-4">
                
                <button
                    className="absolute bottom-20 right-80 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded"
                    onClick={handlePlayAgain}
                >
                    Play Again
                </button>
                {/* Go to Home Button */}
                <button
                    className="absolute bottom-20 left-80 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded"
                    onClick={handleGoHome}
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Result;
