const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGO_URI = 'mongodb+srv://ecommwebsite2025:jUMGxXuUVQwv3FNV@cluster0.i6iebyp.mongodb.net/';

const productImages = [
    {
      name: "Cotton Raw Silk",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["White", "Beige"],
      description: "Handwoven cotton raw silk saree, soft and elegant.",
      stock: 10,
      photos: ["/Cotton Raw Silk.jpg"],
      productCode: "CRS001"
    },
    {
      name: "Cotton Raw Silk 2",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2099,
      colors: ["Cream"],
      description: "Premium cotton raw silk saree with traditional motifs.",
      stock: 8,
      photos: ["/Cotton Raw Silk 2.jpg"],
      productCode: "CRS002"
    },
    {
      name: "Cotton Raw Silk 3",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2199,
      colors: ["Ivory"],
      description: "Elegant cotton raw silk saree, lightweight and comfortable.",
      stock: 7,
      photos: ["/Cotton Raw Silk 3.jpg"],
      productCode: "CRS003"
    },
    {
      name: "Cotton Raw Silk 4",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2299,
      colors: ["Off White"],
      description: "Classic cotton raw silk saree with subtle patterns.",
      stock: 6,
      photos: ["/Cotton Raw Silk 4.jpg"],
      productCode: "CRS004"
    },
    {
      name: "Cotton Raw Silk 5",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2399,
      colors: ["White", "Gold"],
      description: "Handcrafted cotton raw silk saree with golden border.",
      stock: 5,
      photos: ["/Cotton Raw Silk 5.jpg"],
      productCode: "CRS005"
    },
    {
      name: "Cotton Raw Silk 6",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2499,
      colors: ["Cream", "Pink"],
      description: "Soft cotton raw silk saree with pink highlights.",
      stock: 4,
      photos: ["/Cotton Raw Silk 6.jpg"],
      productCode: "CRS006"
    },
    {
      name: "Cotton Raw Silk 7",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2599,
      colors: ["White", "Blue"],
      description: "Trendy cotton raw silk saree with blue border.",
      stock: 3,
      photos: ["/Cotton Raw Silk 7.jpg"],
      productCode: "CRS007"
    },
    {
      name: "Cotton Raw Silk 8",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2699,
      colors: ["White", "Red"],
      description: "Cotton raw silk saree with red pallu.",
      stock: 2,
      photos: ["/Cotton Raw Silk 8.jpg"],
      productCode: "CRS008"
    },
    {
      name: "Cotton Raw Silk 9",
      mainCategory: "Saree",
      apparelType: "Silk",
      subcategories: "Raw Silk",
      sizesAvailable: ["Free Size"],
      price: 2799,
      colors: ["White", "Green"],
      description: "Designer cotton raw silk saree with green border.",
      stock: 2,
      photos: ["/Cotton Raw Silk 9.jpg"],
      productCode: "CRS009"
    },
    {
      name: "ERI FIBRE STOLE COLOR V1",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Fibre Stole",
      sizesAvailable: ["Free Size"],
      price: 1899,
      colors: ["Natural"],
      description: "Eri fibre stole, natural color, eco-friendly.",
      stock: 10,
      photos: ["/Home Page/ERI FIBRE STOLE COLOR V1.jpg"],
      productCode: "EFS001"
    },
    {
      name: "ERI FIBRE STOLE COLOR V2",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Fibre Stole",
      sizesAvailable: ["Free Size"],
      price: 1899,
      colors: ["Natural"],
      description: "Eri fibre stole, soft and warm.",
      stock: 8,
      photos: ["/Home Page/ERI FIBRE STOLE COLOR V2.jpg"],
      productCode: "EFS002"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V1",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Yellow"],
      description: "Eri stole dyed with organic colors.",
      stock: 7,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V1.jpg"],
      productCode: "EOD001"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V2",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Pink"],
      description: "Eri stole with pink organic dye.",
      stock: 6,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V2.jpg"],
      productCode: "EOD002"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V3",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Blue"],
      description: "Eri stole with blue organic dye.",
      stock: 5,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V3.jpg"],
      productCode: "EOD003"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V4",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Green"],
      description: "Eri stole with green organic dye.",
      stock: 4,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V4.jpg"],
      productCode: "EOD004"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V5",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Orange"],
      description: "Eri stole with orange organic dye.",
      stock: 3,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V5.jpg"],
      productCode: "EOD005"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V6",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Red"],
      description: "Eri stole with red organic dye.",
      stock: 2,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V6.jpg"],
      productCode: "EOD006"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V7",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Purple"],
      description: "Eri stole with purple organic dye.",
      stock: 2,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V7.jpg"],
      productCode: "EOD007"
    },
    {
      name: "ERI ORGANIC DYE STOLE COLOR V8",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Organic Dye",
      sizesAvailable: ["Free Size"],
      price: 1999,
      colors: ["Brown"],
      description: "Eri stole with brown organic dye.",
      stock: 2,
      photos: ["/Home Page/ERI ORGANIC DYE STOLE COLOR V8.jpg"],
      productCode: "EOD008"
    },
    {
      name: "ERI SAREE COLOR V1",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Yellow"],
      description: "Eri saree in yellow color.",
      stock: 5,
      photos: ["/Home Page/ERI SAREE COLOR V1.jpg"],
      productCode: "ESC001"
    },
    {
      name: "ERI SAREE COLOR V2",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Pink"],
      description: "Eri saree in pink color.",
      stock: 4,
      photos: ["/Home Page/ERI SAREE COLOR V2.jpg"],
      productCode: "ESC002"
    },
    {
      name: "ERI SAREE COLOR V3",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Blue"],
      description: "Eri saree in blue color.",
      stock: 3,
      photos: ["/Home Page/ERI SAREE COLOR V3.jpg"],
      productCode: "ESC003"
    },
    {
      name: "ERI SAREE COLOR V4",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Green"],
      description: "Eri saree in green color.",
      stock: 2,
      photos: ["/Home Page/ERI SAREE COLOR V4.jpg"],
      productCode: "ESC004"
    },
    {
      name: "ERI SAREE COLOR V5",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Red"],
      description: "Eri saree in red color.",
      stock: 2,
      photos: ["/Home Page/ERI SAREE COLOR V5.jpg"],
      productCode: "ESC005"
    },
    {
      name: "ERI SAREE COLOR V6",
      mainCategory: "Saree",
      apparelType: "Eri Silk",
      subcategories: "Color Saree",
      sizesAvailable: ["Free Size"],
      price: 2999,
      colors: ["Purple"],
      description: "Eri saree in purple color.",
      stock: 2,
      photos: ["/Home Page/ERI SAREE COLOR V6.jpg"],
      productCode: "ESC006"
    },
    {
      name: "ERI SHAWL COLOR V1",
      mainCategory: "Shawl",
      apparelType: "Eri Silk",
      subcategories: "Color Shawl",
      sizesAvailable: ["Free Size"],
      price: 2499,
      colors: ["Yellow"],
      description: "Eri shawl in yellow color.",
      stock: 5,
      photos: ["/Home Page/ERI SHAWL COLOR V1.jpg"],
      productCode: "ESH001"
    },
    {
      name: "ERI SHAWL COLOR V2",
      mainCategory: "Shawl",
      apparelType: "Eri Silk",
      subcategories: "Color Shawl",
      sizesAvailable: ["Free Size"],
      price: 2499,
      colors: ["Pink"],
      description: "Eri shawl in pink color.",
      stock: 4,
      photos: ["/Home Page/ERI SHAWL COLOR V2.jpg"],
      productCode: "ESH002"
    },
    {
      name: "ERI SHAWL COLOR V3",
      mainCategory: "Shawl",
      apparelType: "Eri Silk",
      subcategories: "Color Shawl",
      sizesAvailable: ["Free Size"],
      price: 2499,
      colors: ["Blue"],
      description: "Eri shawl in blue color.",
      stock: 3,
      photos: ["/Home Page/ERI SHAWL COLOR V3.jpg"],
      productCode: "ESH003"
    },
    {
      name: "ERI SHAWL COLOR V4",
      mainCategory: "Shawl",
      apparelType: "Eri Silk",
      subcategories: "Color Shawl",
      sizesAvailable: ["Free Size"],
      price: 2499,
      colors: ["Green"],
      description: "Eri shawl in green color.",
      stock: 2,
      photos: ["/Home Page/ERI SHAWL COLOR V4.jpg"],
      productCode: "ESH004"
    },
    {
      name: "ERI STOLE - GENTS1",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Gents Stole",
      sizesAvailable: ["Free Size"],
      price: 1799,
      colors: ["White"],
      description: "Eri stole for gents, classic white.",
      stock: 5,
      photos: ["/Home Page/ERI STOLE - GENTS1.jpg"],
      productCode: "EGS001"
    },
    {
      name: "ERI STOLE - GENTS2",
      mainCategory: "Stole",
      apparelType: "Eri Silk",
      subcategories: "Gents Stole",
      sizesAvailable: ["Free Size"],
      price: 1799,
      colors: ["Beige"],
      description: "Eri stole for gents, beige color.",
      stock: 4,
      photos: ["/Home Page/ERI STOLE - GENTS2.jpg"],
      productCode: "EGS002"
    },
    {
      name: "Eri handwoven design shawls",
      mainCategory: "Shawl",
      apparelType: "Eri Silk",
      subcategories: "Handwoven",
      sizesAvailable: ["Free Size"],
      price: 2199,
      colors: ["Multi"],
      description: "Handwoven Eri shawl with traditional designs.",
      stock: 3,
      photos: ["/Home Page/Eri handwoven design shawls.JPG"],
      productCode: "EHW001"
    },
    {
      name: "MugaSaree",
      mainCategory: "Saree",
      apparelType: "Muga Silk",
      subcategories: "Traditional",
      sizesAvailable: ["Free Size"],
      price: 3999,
      colors: ["Golden"],
      description: "Traditional Assamese Muga silk saree.",
      stock: 2,
      photos: ["/Home Page/MugaSaree.jpg"],
      productCode: "MGS001"
    }
  ];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Product.deleteMany({});
    await Product.insertMany(productImages);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed(); 