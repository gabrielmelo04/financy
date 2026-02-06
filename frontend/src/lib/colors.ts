export const colorMap: Record<string, { bg: string; text: string }> = {
  "orange-light": { bg: "bg-orange-light", text: "text-orange-dark" },
  "purple-light": { bg: "bg-purple-light", text: "text-purple-dark" },
  "blue-light": { bg: "bg-blue-light", text: "text-blue-dark" },
  "red-light": { bg: "bg-red-light", text: "text-red-dark" },
  "green-light": { bg: "bg-green-light", text: "text-green-dark" },
  "yellow-light": { bg: "bg-yellow-light", text: "text-yellow-dark" },
  "pink-light": { bg: "bg-pink-light", text: "text-pink-dark" },
};

export const getColor = (colorName?: string) => {
  return colorMap[colorName as string] || { bg: "bg-gray-200", text: "text-gray-800" };
};
