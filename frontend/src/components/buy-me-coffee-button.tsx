interface BuyMeCoffeeButtonProps {
  size?: 'sm' | 'md' | 'lg';
}

const HEIGHTS: Record<NonNullable<BuyMeCoffeeButtonProps['size']>, number> = {
  sm: 35,
  md: 45,
  lg: 55,
};

const IMG_URL =
  'https://img.buymeacoffee.com/button-api/?text=Alimenta filamentOS&emoji=🧵 &slug=luprintech&button_colour=fd99ff&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00';

export function BuyMeCoffeeButton({ size = 'md' }: BuyMeCoffeeButtonProps) {
  const height = HEIGHTS[size];
  return (
    <a
      href="https://www.buymeacoffee.com/luprintech"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <img
        src={IMG_URL}
        alt="Apoya FilamentOS en Buy Me a Coffee"
        style={{ height: `${height}px`, borderRadius: 8, display: 'block' }}
      />
    </a>
  );
}
