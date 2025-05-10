import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  day: { type: String, required: true },
  date: { type: String, required: true },
  details: { type: String, required: true },
});

const FlightSchema = new mongoose.Schema({
  from: { type: String, required: false },
  to: { type: String, required: false },
  departureTime: { type: String, required: false },
  arrivalTime: { type: String, required: false },
  duration: { type: String, required: false },
});

const AccommodationSchema = new mongoose.Schema({
  city: { type: String, required: false },
  country: { type: String, required: false },
  hotel: { type: String, required: false },
  checkIn: { type: String, required: false },
  checkOut: { type: String, required: false },
  image: {type: String},
});

const ReportingSchema = new mongoose.Schema({
  guestType: { type: String, required: false },
  reportingPoint: { type: String, required: false },
  droppingPoint: { type: String, required: false },
});

const TravelPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    tripType: { type: String, required: true },
    travelType: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    itineraryMode: { type: String, enum: ["manual", "pdf"], default: "manual" },
    itineraryPdf: { type: String }, // URL to the PDF file

    itinerary: [ItinerarySchema], // Embedded Itinerary details
    flights: { type: [FlightSchema], default: [] }, // Optional Flight details
    accommodations: { type: [AccommodationSchema], default: [] }, // Optional Accommodation details
    reporting: { type: ReportingSchema, required: false }, // Optional Reporting object
  },
  { timestamps: true }
);

const TravelPackage = mongoose.model("TravelPackage", TravelPackageSchema);
export default TravelPackage;
