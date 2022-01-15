import Compressor from "compressorjs";
import { ref, watch } from "vue";

export const compressImage = (filesImages) => {
  const compressedImage = ref(null);
  const uploadableImage = ref(null);

  watch(filesImages, (value) => {
    if (!value) return false;
    compressedImage.value = null;
    uploadableImage.value = null;
    new Compressor(value, {
      quality: 0.5,
      success(result) {
        compressedImage.value = URL.createObjectURL(result);
        uploadableImage.value = result;
      },
      error(err) {
        console.log(err.message);
      },
    });
  });

  return {
    filesImages,
    uploadableImage,
    compressedImage,
  };
};

// const result = await new Promise((resolve, reject) => {
//   new Compressor(file, {
//     success: resolve,
//     error: reject,
//   });
// });

export const compress = async (file, quality = 0.5) =>
  await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: quality,
      success: resolve,
      error: reject,
    });
  });
