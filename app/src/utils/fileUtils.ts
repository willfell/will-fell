import fs from "fs";
import path from "path";

/**
 * Get all image files from a directory within the public folder
 * @param directory Path relative to the public folder
 * @returns Array of image file paths
 */
export function getImagesFromDirectory(directory: string): string[] {
  try {
    // Get absolute path to the directory
    const publicDir = path.join(process.cwd(), "public");
    const dirPath = path.join(publicDir, directory);

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory not found: ${dirPath}`);
      return [];
    }

    // Get all files in the directory
    const files = fs.readdirSync(dirPath);

    // Filter for image files
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Create paths relative to the public directory
    return imageFiles.map((file) => `/${directory}/${file}`);
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}
