import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import rockImg from '../images/rock.jpg'; 
import paperImg from '../images/paper.jpg';
import scissorsImg from '../images/scissors.jpg';
import backgroundImg from '../images/background_img1.jpg'; // Background for the game
import './animation.css'; // Game-style animation

const socket = io('http://localhost:3000'); // Adjust the URL as needed

const PlayWithStranger = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false); // True once the game starts
    const [playerHand, setPlayerHand] = useState('');
    const [opponentHand, setOpponentHand] = useState(''); // Placeholder for opponent's hand
    const [score, setScore] = useState({ player: 0, opponent: 0 });
    const [isShaking, setIsShaking] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        // Listen for opponent joining the room
        socket.on("room:get", (roomData) => {
            console.log("Opponent joined:", roomData);
            setIsWaiting(false); // Stop waiting once opponent joins
            setIsGameActive(true); // Game starts
            clearTimeout(timeoutId); // Cancel the home redirection
        });

        socket.on("room:unavailable", (message) => {
            setError(message);
            setIsWaiting(false);
        });

        // Listen for opponent's move
        socket.on("game:opponentMove", (opponentChoice) => {
            setOpponentHand(opponentChoice);
            determineWinner(playerHand, opponentChoice); // Determine the winner
        });

        return () => {
            socket.off("room:get");
            socket.off("room:unavailable");
            socket.off("game:opponentMove");
            clearTimeout(timeoutId);
        };
    }, [playerHand, timeoutId]);

    const createRoom = () => {
        setError('');
        setIsWaiting(true); // Start waiting for opponent

        // Set timeout for redirecting to home page after 30 seconds if no opponent
        const id = setTimeout(() => {
            setIsWaiting(false);
            navigate('/'); // Redirect to home
        }, 30000);
        setTimeoutId(id);

        // Create room for playing with a stranger
        socket.emit('room:create', { type: 'stranger' }, (err, roomID) => {
            if (err) {
                setError(err);
                setIsWaiting(false);
                clearTimeout(timeoutId);
            }
        });
    };

    // Handle player's move
    const handlePlayerMove = (choice) => {
        if (!isGameActive) return; // Prevent selecting before game starts
        setPlayerHand(choice);
        setIsShaking(true); // Add shake animation
        socket.emit('game:playerMove', choice); // Emit player's choice

        setTimeout(() => {
            setIsShaking(false);
        }, 500);
    };

    // Determine the winner
    const determineWinner = (playerMove, opponentMove) => {
        if (playerMove === opponentMove) return; // It's a draw

        if (
            (playerMove === 'rock' && opponentMove === 'scissors') ||
            (playerMove === 'paper' && opponentMove === 'rock') ||
            (playerMove === 'scissors' && opponentMove === 'paper')
        ) {
            setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
            setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
        }
    };

    return (
        <div
            className="bg-cover bg-center w-full h-screen"
            style={{ backgroundImage: `url(${backgroundImg})` }} // Set background for the game
        >
            {/* "Are You Ready" button at the top */}
            <div className="absolute top-20 w-full flex justify-center">
                {!isGameActive && (
                    <button
                        onClick={createRoom}
                        className="bg-red-500 text-black w-60 h-50 rounded-full flex items-center justify-center mb-2"
                        
                    >
                        {isWaiting ? "Waiting for an opponent..." : "Click Here To Start"}
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center h-full px-20">
                {/* Player Hand (Left side) */}
                <div className="flex flex-col items-center w-1/3">
                    <h2 className="text-white text-3xl mb-4">You</h2>
                    <div className={`w-50 h-40 ${isShaking ? 'shake' : ''}`}>
                        {playerHand ? (
                            <img
                                src={playerHand === 'rock' ? rockImg : playerHand === 'paper' ? paperImg : scissorsImg}
                                alt={playerHand}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-500" />
                        )}
                    </div>
                    <h3 className="text-white text-2xl">Score: {score.player}</h3>
                </div>

                {/* Opponent Hand (Right side) */}
                <div className="flex flex-col items-center w-1/3">
                    <h2 className="text-white text-3xl mb-4">
                        {isWaiting ? "Waiting for an opponent..." : "Opponent"}
                    </h2>
                    <div className={`w-50 h-40 ${isShaking ? 'shake' : ''}`}>
                        {opponentHand ? (
                            <img
                                src={opponentHand === 'rock' ? rockImg : opponentHand === 'paper' ? paperImg : scissorsImg}
                                alt={opponentHand}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-500" />
                        )}
                    </div>
                    <h3 className="text-white text-2xl">Score: {score.opponent}</h3>
                </div>
            </div>

            {/* Player Move Options (Disabled until opponent joins) */}
            <div className="absolute bottom-8 w-full flex justify-center space-x-6">
                <div
                    className={`bg-white p-4 rounded-lg shadow-lg transition-transform ${isGameActive ? 'hover:scale-110 cursor-pointer' : 'opacity-50'}`}
                    onClick={() => handlePlayerMove('rock')}
                >
                    <img src={rockImg} alt="rock" className="w-20 h-20" />
                    <h1>Rock</h1>
                </div>
                <div
                    className={`bg-white p-4 rounded-lg shadow-lg transition-transform ${isGameActive ? 'hover:scale-110 cursor-pointer' : 'opacity-50'}`}
                    onClick={() => handlePlayerMove('paper')}
                >
                    <img src={paperImg} alt="paper" className="w-20 h-20" />
                    <h1>Paper</h1>
                </div>
                <div
                    className={`bg-white p-4 rounded-lg shadow-lg transition-transform ${isGameActive ? 'hover:scale-110 cursor-pointer' : 'opacity-50'}`}
                    onClick={() => handlePlayerMove('scissors')}
                >
                    <img src={scissorsImg} alt="scissors" className="w-20 h-20" />
                    <h1>Scissors</h1>
                </div>
            </div>
        </div>
    );
};

export default PlayWithStranger;
