type Card = {
  src: string;
  id: number;
  value: string;
  matched?: boolean;
};

type CardProps = {
  card: Card;
  handleChoice: (card: Card) => void;
  flipped?: boolean;
  disabled?: boolean;
};
