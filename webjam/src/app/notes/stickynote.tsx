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
    const colors = ["#FFFCD8", "#FCD3EC", "#D3E6FF", "#DFFFD5"];
    return colors[index % colors.length];
  };
  return (
    <div className="flex flex-col items-center gap-3 break-inside-avoid hover:scale-105 transition-transform duration-300" style={{ marginBottom: "50px" }}>
      {header && (
        <div className="mt-9 text-[16px] text-[#353D48] font-['Nunito'] font-normal">
          {header.replace(/<[^>]+>/g, "")}
        </div>
      )}

      <div
        className="p-10 shadow-lg break-words inline-block w-auto max-w-xs rounded-[8px]"
        style={{ backgroundColor: chooseColor() }}
      >
        <div className="text-gray-600">{content}</div>
      </div>
      <div
        className="whitespace-pre-wrap"
        style={{
          fontFamily: "var(--font-nunito-sans)",
          fontWeight: 400,
          color: "#353D48",
        }}
      >
        Date: {date}
      </div>
    </div>
  );
}
