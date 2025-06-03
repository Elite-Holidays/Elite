import TravelPackage from "../models/TravelPackage.js";
import AboutUs from "../models/AboutUs.js";
import getGeminiResponse from "../services/geminiService.js";

export const getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    // Prepare context from database
    let context = '';

    // Get company info
    const companyInfo = await AboutUs.findOne();
    if (companyInfo) {
      context += `Company Information:\nName: ${companyInfo.name}\nRole: ${companyInfo.designation}\n\n`;
    }

    // Get all packages info
    const allPackages = await TravelPackage.find()
      .select('title price duration location tripType travelType isPopular')
      .sort({ price: 1 }); // Sort by price ascending

    if (allPackages?.length > 0) {
      // Popular packages
      const popularPackages = allPackages.filter(pkg => pkg.isPopular);
      if (popularPackages.length > 0) {
        context += 'Popular Packages:\n';
        popularPackages.forEach((pkg, index) => {
          context += `${index + 1}. ${pkg.title}\n`;
          context += `   Location: ${pkg.location}\n`;
          context += `   Trip Type: ${pkg.tripType}\n`;
          context += `   Tour Type: ${pkg.travelType || 'General'}\n`;
          context += `   Duration: ${pkg.duration}\n`;
          context += `   Price: ₹${pkg.price.toLocaleString('en-IN')}\n\n`;
        });
      }

      // Package price ranges by type
      const packagesByType = {};
      allPackages.forEach(pkg => {
        if (!packagesByType[pkg.tripType]) {
          packagesByType[pkg.tripType] = {
            packages: [],
            minPrice: pkg.price,
            maxPrice: pkg.price
          };
        }
        packagesByType[pkg.tripType].packages.push(pkg);
        packagesByType[pkg.tripType].minPrice = Math.min(packagesByType[pkg.tripType].minPrice, pkg.price);
        packagesByType[pkg.tripType].maxPrice = Math.max(packagesByType[pkg.tripType].maxPrice, pkg.price);
      });

      context += 'Available Packages by Type:\n';
      Object.entries(packagesByType).forEach(([type, data]) => {
        context += `${type}:\n`;
        context += `Price Range: ₹${data.minPrice.toLocaleString('en-IN')} to ₹${data.maxPrice.toLocaleString('en-IN')}\n`;
        data.packages.forEach((pkg, index) => {
          context += `${index + 1}. ${pkg.title}\n`;
          context += `   Location: ${pkg.location}\n`;
          context += `   Trip Type: ${pkg.tripType}\n`;
          context += `   Tour Type: ${pkg.travelType || 'General'}\n`;
          context += `   Duration: ${pkg.duration}\n`;
          context += `   Price: ₹${pkg.price.toLocaleString('en-IN')}\n\n`;
        });
      });
    }

    // Get price range
    const priceRange = await TravelPackage.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    if (priceRange?.length > 0) {
      context += `Price Range: ₹${priceRange[0].minPrice.toLocaleString('en-IN')} to ₹${priceRange[0].maxPrice.toLocaleString('en-IN')}\n\n`;
    }

    // Get package types
    const packages = await TravelPackage.find().select('tripType').distinct('tripType');
    if (packages?.length > 0) {
      context += 'Available Package Types:\n';
      packages.forEach(type => {
        context += `- ${type}\n`;
      });
      context += '\n';
    }

    // Get response from Gemini
    let response = await getGeminiResponse(message, context);

    // Fallback response if Gemini fails
    if (!response) {
      if (lowerMessage.includes("owner") || lowerMessage.includes("company")) {
        if (companyInfo) {
          response = `Our company is led by ${companyInfo.name}, who serves as ${companyInfo.designation}. We're dedicated to providing exceptional travel experiences.`;
        } else {
          response = "Elite Holidays is a premier travel company dedicated to providing exceptional travel experiences. Our team of experienced professionals is committed to making your dream vacation a reality.";
        }
      } else {
        response = "I can help you with:\n- Finding trending tour packages\n- Package details and pricing\n- Company information\n\nPlease let me know what interests you, and I'll be happy to assist!";
      }
    }

    res.json({ response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
