import { Button } from "./ui/button";

export default function ShapeSelectionIcon( {icon, onClick, isSelected}: {icon: React.ReactNode, onClick: ()=> void, isSelected: boolean}) {
    return (
      <Button
        onClick={onClick}
        className={`bg-yellow-200 text-black hover:bg-yellow-300 ${isSelected ? "bg-yellow-300 text-red-500" : ""}`}
      >
        {icon}
      </Button>
    );
}