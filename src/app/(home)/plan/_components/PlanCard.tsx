import { Button } from "@/components/ui/button";
import CheckIcon from "@/components/ui/CheckIcon";

export default function PlanCard({
  title,
  price,
  description,
  buttonLabel,
  buttonDisabled,
  benefits,
  animationDelay,
}: {
  title: string;
  price: string;
  description: string;
  buttonLabel: string;
  buttonDisabled: boolean;
  benefits: string[];
  animationDelay: string;
}) {
  return (
    <div
      className={`flex flex-col p-6 border border-gray-200 rounded-lg w-80 h-96
      animate-flip-in`}
      style={{ animationDelay }}
    >
      <div className="text-3xl font-semibold">{title}</div>
      <div className="text-sm mt-4">
        <span className="text-4xl font-bold">{price}</span>원
        <div className="text-sm text-gray-500 text-right">한 달 기준</div>
      </div>
      <div className="mt-4">{description}</div>
      <Button
        className={`w-full mt-4 ${
          buttonDisabled
            ? "cursor-not-allowed bg-gray-100 hover:bg-gray-100 text-gray-400"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } rounded-full`}
      >
        {buttonLabel}
      </Button>
      <ul className="list-none text-sm space-y-2 mt-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}
