import React from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import backgroundImg from '../images/background_img.jpg'; // Background image

const socket = io('https://rock-paper-scissors-12.onrender.com'); // Adjust the URL as needed

const Home = () => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-cover bg-center w-full h-screen"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <div className="absolute bottom-20 right-20 flex flex-col space-y-4">
                <button
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 hover:bg-blue-800"
                    onClick={()=>{navigate('/game')}}
                >
                    Play with Computer
                </button>
                
            </div>
            <div className="absolute bottom-40 right-20 flex flex-col space-y-4">
                <button
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors duration-300 hover:bg-blue-800"
                    onClick={()=>{navigate('/playwithstranger')}}
                >
                    Play with Stranger
                </button>
                
            </div>
        </div>
    );
};

export default Home;
