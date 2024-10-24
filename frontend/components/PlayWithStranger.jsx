import React, { useState, useEffect } from 'react'; 
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3000'); // Adjust the URL as needed

const PlayWithStranger = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        // Listen for room data
        socket.on("room:get", (roomData) => {
            console.log("Room data:", roomData);
            // Navigate to the game page
            navigate('/game', { state: { roomID: roomData.roomId } });
        });

        // Listen for "no room available" if no opponent joins in 1 minute
        socket.on("room:unavailable", (message) => {
            setError(message);
            setIsWaiting(false); // Stop waiting
        });

        return () => {
            socket.off("room:get");
            socket.off("room:unavailable");
        };
    }, [navigate]);

    const createRoom = () => {
        setError(''); // Reset error
        setIsWaiting(true); // Start waiting for an opponent
        socket.emit('room:create', { type: 'stranger' }, (err, roomID) => {
            if (err) {
                setError(err); // Handle any error
                setIsWaiting(false); // Stop waiting
            }
        });
    };

    return (
        <div className="flex flex-col items-center">
            <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mb-2">
                {isWaiting ? "Waiting for an opponent..." : "Play with Stranger"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default PlayWithStranger;
