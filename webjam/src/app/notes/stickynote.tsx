export default function StickyNote({
  date,
  content,
}: {
  date: number;
  content: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 break-inside-avoid">
      <div className="bg-yellow-200 p-3 mt-9 shadow-lg break-words inline-block w-auto max-w-xs ">
        <div className="text-gray-600">{content}</div>
      </div>
      <div className="whitespace-pre-wrap">Date: {date}</div>
    </div>
  );
}
