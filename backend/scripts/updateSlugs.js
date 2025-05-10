import mongoose from 'mongoose';
import TravelPackage from '../models/TravelPackage.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate a URL-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    updatePackageSlugs();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Update all packages without slugs
async function updatePackageSlugs() {
  try {
    // Find all packages
    const packages = await TravelPackage.find({ slug: { $exists: false } });
    console.log(`Found ${packages.length} packages without slugs`);

    for (const pkg of packages) {
      let baseSlug = generateSlug(pkg.title);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists, if so, append a number
      while (await TravelPackage.findOne({ slug, _id: { $ne: pkg._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // Update the package with the new slug
      pkg.slug = slug;
      await pkg.save();
      console.log(`Updated package: ${pkg.title} -> ${slug}`);
    }
    
    console.log('All packages have been updated with slugs');
    process.exit(0);
  } catch (error) {
    console.error('Error updating package slugs:', error);
    process.exit(1);
  }
} 