export default function StickyNote({
  date,
  content,
  header,
  index,
}: {
  date: number;
  content: string;
  header?: string;
  index: number;
}) {
  const chooseColor = () => {
    const colors = [
      "bg-yellow-200",
      "bg-pink-200",
      "bg-blue-200",
      "bg-green-200",
    ];
    return colors[index % colors.length];
  };
  return (
    <div className="flex flex-col items-center gap-3 break-inside-avoid hover:scale-105 transition-transform duration-300">
      {header && (
        <div className="mt-9 text-[16px] text-[#353D48] font-['Nunito'] font-normal">
          {header.replace(/<[^>]+>/g, "")}
        </div>
      )}

      <div
        className={`${chooseColor()} p-3 shadow-lg break-words inline-block w-auto max-w-xs `}
      >
        <div className="text-gray-600">{content}</div>
      </div>
      <div className="whitespace-pre-wrap">Date: {date}</div>
    </div>
  );
}
