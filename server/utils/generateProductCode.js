// utils/generateProductCode.js

function generateProductCode(data) {
  const cat = data.mainCategory?.slice(0, 3).toUpperCase();
  const sub = data.subcategories?.[0]?.slice(0, 3).toUpperCase() || "GEN";
  const unique = Math.floor(1000 + Math.random() * 9000);
  return `${cat}-${sub}-${unique}`;
}

module.exports = generateProductCode;
