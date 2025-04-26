import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  day: { type: String, required: true },
  date: { type: String, required: true },
  details: { type: String, required: true },
});

const FlightSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
});

const AccommodationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  hotel: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  image: {type: String},
});

const ReportingSchema = new mongoose.Schema({
  guestType: { type: String, required: true },
  reportingPoint: { type: String, required: true },
  droppingPoint: { type: String, required: true },
});

const TravelPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    tripType: { type: String, required: true },
    travelType: { type: String, required: true },

    itinerary: [ItinerarySchema], // Embedded Itinerary details
    flights: [FlightSchema], // Embedded Flight details
    accommodations: [AccommodationSchema], // Embedded Accommodation details
    reporting: ReportingSchema, // Single Reporting object
  },
  { timestamps: true }
);

const TravelPackage = mongoose.model("TravelPackage", TravelPackageSchema);
export default TravelPackage;
