import { JSX, KeyboardEvent } from "react";

export const Card = ({
  card,
  handleChoice,
  flipped,
  disabled,
}: CardProps): JSX.Element => {
  const handleClick = () => {
    if (flipped) {
      return;
    }

    if (!disabled) {
      handleChoice(card);
    }
  };

  const handleKeypress = (event: KeyboardEvent) => {
    if (flipped) {
      return;
    }

    if (!disabled && event.key === "Enter") {
      handleChoice(card);
    }
  };

  return (
    <div
      tabIndex={1}
      key={card.id}
      className="card"
      onClick={handleClick}
      onKeyDown={handleKeypress}
    >
      <div className={flipped ? "flipped" : "w-full h-full"}>
        <img className="front" src={card.src} />
        <img className="back" src="/CardBackground.jpg" />
      </div>
    </div>
  );
};
