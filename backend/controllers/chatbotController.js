import TravelPackage from "../models/TravelPackage.js";
import AboutUs from "../models/AboutUs.js";
import getGeminiResponse from "../services/geminiService.js";

export const getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    
    // Check if the message is about packages or destinations
    const isPackageQuery = lowerMessage.includes('package') || 
                          lowerMessage.includes('trip') || 
                          lowerMessage.includes('tour') || 
                          lowerMessage.includes('destination') || 
                          lowerMessage.includes('place') ||
                          lowerMessage.includes('travel') ||
                          lowerMessage.includes('vacation') ||
                          lowerMessage.includes('holiday');
    
    // Check if the message is about booking or contact
    const isBookingQuery = lowerMessage.includes('book') || 
                          lowerMessage.includes('reserve') || 
                          lowerMessage.includes('reservation');
                          
    const isContactQuery = lowerMessage.includes('contact') || 
                          lowerMessage.includes('email') || 
                          lowerMessage.includes('phone') || 
                          lowerMessage.includes('call') ||
                          lowerMessage.includes('address') ||
                          lowerMessage.includes('location') ||
                          lowerMessage.includes('reach');

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

    // Add specific instruction for package queries
    let userPrompt = message;
    if (isPackageQuery) {
      userPrompt = `${message} (IMPORTANT: Format your response as a numbered list with clear package details. DO NOT respond with a paragraph.)`; 
    }
    
    if (isBookingQuery) {
      userPrompt = `${message} (IMPORTANT: Include booking information and link to https://eliteholidays.com/contact?booking=true in your response)`;
    }
    
    if (isContactQuery) {
      userPrompt = `${message} (IMPORTANT: Provide complete contact information including email, phone, and location)`;
    }

    // Get response from Gemini
    let response = await getGeminiResponse(userPrompt, context);

    // Fallback response if Gemini fails
    if (!response) {
      if (lowerMessage.includes("owner") || lowerMessage.includes("company")) {
        response = "Our company is led by Suraj. We're dedicated to providing exceptional travel experiences at Elite Holidays.";
      } else if (isBookingQuery) {
        response = "You can book a tour with us in two ways:\n\n" +
                  "1. Contact us directly:\n" +
                  "   Email: eliteholidays3@gmail.com\n" +
                  "   Phone: +91 95950 14141\n\n" +
                  "Our team will help you select the perfect package and complete your booking.";
      } else if (isContactQuery) {
        response = "Here's how you can reach us:\n\n" +
                  "Owner: Suraj\n" +
                  "Email: eliteholidays3@gmail.com\n" +
                  "Phone: +91 95950 14141\n" +
                  "Location: CIDCO Colony, Aurangabad-Maharashtra\n\n" +
                  "Feel free to contact us with any questions or to book a tour!";
      } else if (isPackageQuery) {
        // Fallback response for package queries in list format
        response = "Here are some of our popular packages:\n\n" +
                  "1. Goa Beach Getaway\n" +
                  "   Location: Goa, India\n" +
                  "   Trip Type: Family\n" +
                  "   Tour Type: Beach\n" +
                  "   Duration: 5 Days\n" +
                  "   Price: ₹25,000\n\n" +
                  "2. Kerala Backwaters\n" +
                  "   Location: Kerala, India\n" +
                  "   Trip Type: Family\n" +
                  "   Tour Type: Nature\n" +
                  "   Duration: 7 Days\n" +
                  "   Price: ₹35,000\n\n" +
                  "To book a tour, visit: https://eliteholidays.com/contact?booking=true";
      } else {
        response = "I can help you with:\n- Finding trending tour packages\n- Package details and pricing\n- Booking information\n- Contact details\n\nPlease let me know what interests you, and I'll be happy to assist!";
      }
    }

    res.json({ response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
