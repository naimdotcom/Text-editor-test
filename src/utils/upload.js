import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const uploadImageToCloudinary = async (file) => {
  try {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "your_cloud_name", // Replace with your cloud name
      },
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // ✅ from Cloudinary
    formData.append("folder", "blog-images"); // optional

    return;
  } catch (error) {
    console.log("🚨 Error uploading image to Cloudinary:", error);
  }
};
const extractImageUrlsFromHTML = (html) => {
  const regex = /<img[^>]*src="([^"]+)"[^>]*>/g;
  const urls = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
};

const replaceImageUrlsInHTML = (html, localUrls, uploadedUrls) => {
  let updatedHtml = html;
  localUrls.forEach((localUrl, index) => {
    updatedHtml = updatedHtml.replace(localUrl, uploadedUrls[index]);
  });
  return updatedHtml;
};

export const uploadBlog = async ({ editor, imageFiles }) => {
  const html = editor.getHTML();
  const localUrls = extractImageUrlsFromHTML(html);
  const uploadedImageUrls = [];

  console.log("📸 Local image URLs:\n", localUrls);

  for (let local of localUrls) {
    const matched = imageFiles.find((item) => item.preview === local);
    if (matched) {
      const uploadedUrl = await uploadImageToCloudinary(matched.file);
      uploadedImageUrls.push(uploadedUrl);
    } else {
      uploadedImageUrls.push(local); // keep remote URLs as is
    }
  }

  const finalHTML = replaceImageUrlsInHTML(html, localUrls, uploadedImageUrls);
  console.log("✅ Final HTML with Cloudinary URLs:\n", finalHTML);
};
