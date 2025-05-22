const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    // todo: fetch Url from backend

    console.log("uploaded Images:" + file.preview);

    return "https://your-cloudinary-url.com/fake-image.jpg";
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

const replaceImageUrlsInHTMLWithMap = (html, urlMap) => {
  let updatedHtml = html;
  for (const [localUrl, cloudUrl] of Object.entries(urlMap)) {
    updatedHtml = updatedHtml.replaceAll(localUrl, cloudUrl);
  }
  return updatedHtml;
};

/**
 * Uploads all local images in the editor content to Cloudinary and replaces
 * their URLs in the HTML.
 *
 * @param {Object} params
 * @param {Editor} params.editor - The Tiptap editor instance.
 * @param {Array<Object>} params.imageFiles - An array of objects with
 *   `preview` and `file` properties, where `preview` is the local URL of the
 *   image in the editor content and `file` is the image file itself.
 * @returns {Promise<string>} The HTML with all local image URLs replaced with
 *   Cloudinary URLs.
 */
export const uploadBlog = async ({ editor, imageFiles }) => {
  const html = editor.getHTML();
  const localUrls = extractImageUrlsFromHTML(html);

  imageFiles = imageFiles.filter((item) => localUrls.includes(item.preview));
  const uploadedImageMap = {};

  console.log("Local image URLs:", localUrls);

  for (let local of localUrls) {
    const matched = imageFiles.find((item) => item.preview === local);
    if (matched) {
      const uploadedUrl = await uploadImageToCloudinary(matched.file);
      uploadedImageMap[local] = uploadedUrl;
    }
  }

  const finalHTML = replaceImageUrlsInHTMLWithMap(html, uploadedImageMap);
  console.log("Final HTML with Cloudinary URLs:", finalHTML);
  return finalHTML;
};
