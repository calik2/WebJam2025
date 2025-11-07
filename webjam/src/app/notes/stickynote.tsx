export default function StickyNote({
  date,
  content,
  header,
  tags,
  index,
}: {
  date: string;
  content: string;
  header?: string;
  tags?: string[];
  index: number;
}) {
  const chooseColor = () => {
    const colors = ["#FFFCD8", "#FCD3EC", "#D3E6FF", "#DFFFD5"];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center gap-3 break-inside-avoid hover:scale-105 transition-transform duration-300">
      {/* Sticky note content */}
      <div
        className="p-6 shadow-lg break-words inline-block w-auto max-w-xs rounded-[8px]"
        style={{ backgroundColor: chooseColor() }}
      >
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap my-1">
            {tags.map((tag, i) => (
              <div
                key={i}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ 
                  fontFamily: "var(--font-nunito-sans), sans-serif",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderColor: "#9CA3AF",
                  color: "#9CA3AF",
                  border: "1px solid"
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <div className="text-gray-600 text-sm mt-2">
          {content}
        </div>
      </div>
      
      {/* Title */}
      {header && (
        <div className="text-[16px] text-[#353D48] font-['Nunito'] font-normal">
          {header.replace(/<[^>]+>/g, "")}
        </div>
      )}
      
      {/* Date */}
      <div
        className="whitespace-pre-wrap text-[16px]"
        style={{
          fontFamily: "var(--font-nunito-sans)",
          fontWeight: 400,
          color: "#353D48",
        }}
      >
        {date}
      </div>
    </div>
  );
}