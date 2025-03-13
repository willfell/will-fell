import Page from "../components/Layout/Page";
import MePage from "../components/MePage";
import fs from "fs";
import path from "path";
import { GetStaticProps } from "next";

interface MePageProps {
  galleryImages: string[];
}

export default function Me({ galleryImages }: MePageProps) {
  return (
    <Page
      description="Photos and personal interests of Will Fellhoelter"
      title="About Me | Will Fellhoelter"
    >
      <MePage galleryImages={galleryImages} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Get path to public directory
  const publicDir = path.join(process.cwd(), "public");
  const galleryDir = path.join(publicDir, "images/life/gallery");

  try {
    // Read all files in the directory
    const files = fs.readdirSync(galleryDir);

    // Filter for image files
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".JPG",
      ".JPEG",
      ".PNG",
      ".GIF",
      ".WEBP",
    ];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext.toLowerCase());
    });

    // Create paths for images
    const galleryImages = imageFiles.map(
      (file) => `/images/life/gallery/${file}`,
    );

    return {
      props: {
        galleryImages,
      },
    };
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    // Fallback to numbered images if there's an error
    const galleryImages = Array.from(
      { length: 6 },
      (_, i) => `/images/life/gallery/${i + 1}.jpg`,
    );

    return {
      props: {
        galleryImages,
      },
    };
  }
};
