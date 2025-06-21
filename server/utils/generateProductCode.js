// utils/generateProductCode.js

function generateProductCode(data) {
  const cat = data.mainCategory?.slice(0, 3).toUpperCase();
  const sub = data.subcategories?.[0]?.slice(0, 3).toUpperCase() || "GEN";
  const color = data.colors?.[0]?.slice(0, 3).toUpperCase() || "COL";
  const size = data.sizesAvailable?.[0]?.toUpperCase() || "SZ";
  const unique = Math.floor(1000 + Math.random() * 9000);
  return `${cat}-${sub}-${color}-${size}-${unique}`;
}

module.exports = generateProductCode;
