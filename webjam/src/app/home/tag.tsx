export default function Tag({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <div className=" gap-3 break-inside-avoid">
      <div className="bg-gray-200 p-3 mt-9 rounded-lg break-words inline-block w-auto max-w-xs ">
        <div
          className="text-gray-600"
          /* Placeholder for tag click handling, i really want it to ONLY save this tag if another one wasn't selected before */
          onClick={onClick}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
