import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import backgroundImg from '../images/background_img1.jpg'; 
import rockImg from '../images/rock.jpg'; 
import paperImg from '../images/paper.jpg';
import scissorsImg from '../images/scissors.jpg';
import './animation.css';

const socket = io('https://rock-paper-scissors-10.onrender.com'); // Adjust the URL as needed

const Game = () => {
    const navigate = useNavigate();
    
    const [playerHand, setPlayerHand] = useState('');
    const [computerHand, setComputerHand] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    
    const [score, setScore] = useState({ 
        player: 0, 
        computer: 0
   });
    
    const getMoveFromComputer = () => {
        const moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * 3)];
    };

    const updateScore = (playerChoice, computerChoice) => {
        if (playerChoice === computerChoice) {
            return; // No points if both choose the same
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            setScore(prevScore => ({ ...prevScore, player: prevScore.player + 1 }));
        } else {
            setScore(prevScore => ({ ...prevScore, computer: prevScore.computer + 1 }));
        }
    };

    const handlePlayerMove = (choice) => {
        const computerChoice = getMoveFromComputer();
        setIsShaking(true);
        setTimeout(() => {
            setPlayerHand(choice);
            setComputerHand(computerChoice);
            updateScore(choice, computerChoice);

            // Check for winner
            if (score.player === 4 && (score.player + 1) === 5) {
                navigate('/result', { state: { message: "Congratulations! You win!" } });
            } else if (score.computer === 4 && (score.computer + 1) === 5) {
                navigate('/result', { state: { message: "You lost! Computer wins!" } });
            }
            
            setIsShaking(false);
        }, 500);
    };

    return (
        <div
            className="bg-cover bg-center w-full h-screen"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <div className="flex justify-between items-center h-full px-20">
                <h2 className="absolute top-20 right-40 text-white text-3xl mb-4">Computer</h2>
                <h2 className="absolute top-20 left-40 text-white text-3xl mb-4">You</h2>
                
               
                <h3 className="absolute bottom-20 left-40 text-white text-3xl">Score: {score.player}</h3>
                <div className="flex flex-col items-center w-1/3">
                    <div className={`w-50 h-40 ${isShaking ? 'shake' : ''}`}>
                        <img
                            src={playerHand === 'rock' ? rockImg : playerHand === 'paper' ? paperImg : scissorsImg}
                            alt={playerHand}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                
                <h3 className="absolute bottom-20 right-40 text-3xl text-white">Score: {score.computer}</h3>
                <div className="flex flex-col items-center w-1/3">
                    <div className={`w-50 h-40 ${isShaking ? 'shake' : ''}`}>
                        <img
                            src={computerHand === 'rock' ? rockImg : computerHand === 'paper' ? paperImg : scissorsImg}
                            alt={computerHand}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Player Options - Bottom Center */}
            <div className="absolute bottom-8 w-full flex justify-center space-x-6">
                <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => handlePlayerMove('rock')}>
                    <img src={rockImg} alt="rock" className="w-20 h-20" />
                    <h1>Rock</h1>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => handlePlayerMove('paper')}>
                    <img src={paperImg} alt="paper" className="w-20 h-20" />
                    <h1>Paper</h1>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => handlePlayerMove('scissors')}>
                    <img src={scissorsImg} alt="scissors" className="w-20 h-20" />
                    <h1>Scissor</h1>
                </div>
            </div>
        </div>
    );
};

export default Game;
