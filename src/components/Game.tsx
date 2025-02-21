import { JSX, useEffect, useState } from "react";
import { Card } from "./Card";
import ReactConfetti from "react-confetti";
import { AnimatePresence, motion } from "motion/react";
import { convertTime } from "../utils/convertTime";

const data = [
  { src: "/Git.svg", value: "Git" },
  { src: "/React.svg", value: "React" },
  { src: "/Tailwind.svg", value: "Tailwind" },
  { src: "/Typescript.svg", value: "TypeScript" },
  { src: "/Vite.svg", value: "Vite" },
  { src: "/CSharp.svg", value: "C Sharp" },
  { src: "/VSCode.svg", value: "Visual Studio Code" },
  { src: "/NodeJS.svg", value: "NodeJS" },
];

export const Game = (): JSX.Element => {
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState<number>(0);

  const [firstSelect, setFirstSelect] = useState<Card | null>(null);
  const [secondSelect, setSecondSelect] = useState<Card | null>(null);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);

  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Window width/height for ReactConfetti
  const width = window.innerWidth;
  const height = window.innerHeight;

  const shuffleCards = () => {
    const shuffledCards = [...data, ...data]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    setCards(shuffledCards);
    setGameOver(false);
    setTurns(0);
    setScore(0);
    setTimer(0);
    setIsTimerActive(false);
  };

  const handleChoice = (card: Card) => {
    if (!isTimerActive) {
      setIsTimerActive(true);
      startTimer();
    }
    return firstSelect ? setSecondSelect(card) : setFirstSelect(card);
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const resetTurn = () => {
    setTurns((prev) => prev + 1);
    setDisabled(false);
    setFirstSelect(null);
    setSecondSelect(null);
  };

  // Make a new game on initial mount
  useEffect(() => {
    shuffleCards();
  }, []);

  // ! Checks the first two clicks. Then disables the ability to click on other cards.
  // ! Then check if the src/image links matches. IF they match, then we add the `matched` property to the card object.
  useEffect(() => {
    if (firstSelect && secondSelect) {
      setDisabled(true);
      if (firstSelect.src === secondSelect.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === firstSelect.src) {
              setScore(score + 1);
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000); // Give the user 1 second before the unmatched cards flips back.
      }
    }
  }, [firstSelect, secondSelect, score]);

  // Check if the game is over
  useEffect(() => {
    const gameOver = cards.length > 0 && cards.every((card) => card.matched); // Check if every card has the `matched` propterty.
    if (gameOver) {
      setGameOver(true);
      setIsTimerActive(false);
      if (intervalId) {
        clearInterval(intervalId); // Stop the timer interval by ID
      }
    }
  }, [cards, turns, intervalId]);

  const newGame = () => {
    if (intervalId) {
      clearInterval(intervalId); // Stop the timer interval by ID
    }
    setCards((prevCards) => {
      return prevCards.map((card) => {
        return { ...card, matched: false }; // Ensure all cards are flipped back
      });
    });
    setTimeout(() => {
      resetTurn();
      shuffleCards();
    }, 250); // Taking into account the transition duration.
  };

  return (
    <div className="w-full h-full">
      {cards.length ? (
        <div className="gap-4 flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <div className="text-4xl">Turns: {turns}</div>
            <div className="text-4xl">
              Score: {score}/{data.length}
            </div>
            <div className="text-4xl">{convertTime(timer)}</div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => {
              return (
                <Card
                  card={card}
                  key={card.id}
                  flipped={
                    card === firstSelect ||
                    card === secondSelect ||
                    card.matched
                  }
                  handleChoice={handleChoice}
                  disabled={disabled}
                />
              );
            })}
          </div>
          {gameOver ? null : (
            <button aria-label="New Game" onClick={newGame}>
              New Game
            </button>
          )}
        </div>
      ) : null}
      {gameOver ? (
        <AnimatePresence>
          <motion.div
            className="absolute flex-col top-1/2 left-1/2 w-full flex justify-center h-full items-center bg-black/50 transform -translate-x-1/2 -translate-y-1/2"
            transition={{ duration: 0.5 }}
            animate={{ opacity: [0, 1] }}
            exit={{ opacity: [1, 0] }}
          >
            <motion.div
              animate={{ scale: [0, 1] }}
              transition={{ duration: 0.5 }}
              exit={{ scale: [1, 0] }}
              className="bg-[#1a1a1a] flex justify-center flex-col gap-2 items-center absolute rounded-md w-[400px] h-[200px] p-4"
            >
              <p className="text-5xl">Game Over</p>
              <p className="text-4xl">
                You won in {turns} turns and in {convertTime(timer)}.
              </p>
              <button
                tabIndex={1}
                autoFocus
                onClick={newGame}
                aria-label="New Game"
                className="text-sm w-full mt-auto flashing"
              >
                New Game
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : null}
      {gameOver ? <ReactConfetti height={height} width={width} /> : null}
    </div>
  );
};
