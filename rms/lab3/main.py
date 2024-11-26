import numpy as np
import cv2
import pywt
from skimage.metrics import peak_signal_noise_ratio as psnr
import matplotlib.pyplot as plt

# Завантаження зображення
def load_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    return cv2.resize(img, (512, 512))

# Реалізація DCT стиснення
def compress_dct(img, block_size=8, keep_fraction=0.5):
    h, w = img.shape
    compressed_img = np.zeros_like(img, dtype=np.float32)

    for i in range(0, h, block_size):
        for j in range(0, w, block_size):
            block = img[i:i+block_size, j:j+block_size]
            dct_block = cv2.dct(np.float32(block))
            
            # Збереження лише певної кількості коефіцієнтів
            mask = np.zeros_like(dct_block)
            n = int(block_size * block_size * keep_fraction)
            mask.flat[:n] = 1
            mask = mask.reshape(block_size, block_size)
            dct_block *= mask
            
            compressed_img[i:i+block_size, j:j+block_size] = cv2.idct(dct_block)
    
    return np.uint8(np.clip(compressed_img, 0, 255))

# Реалізація DWT стиснення
def compress_dwt(img, wavelet='haar', keep_fraction=0.5):
    coeffs = pywt.dwt2(img, wavelet)
    cA, (cH, cV, cD) = coeffs

    # Обрізання коефіцієнтів
    def truncate_coeff(coeff):
        n = int(coeff.size * keep_fraction)
        flat_coeff = coeff.flatten()
        flat_coeff[np.argsort(np.abs(flat_coeff))[:-n]] = 0
        return flat_coeff.reshape(coeff.shape)

    cA = truncate_coeff(cA)
    cH = truncate_coeff(cH)
    cV = truncate_coeff(cV)
    cD = truncate_coeff(cD)

    # Відновлення
    return np.uint8(np.clip(pywt.idwt2((cA, (cH, cV, cD)), wavelet), 0, 255))

# Основна функція
def main():
    # Завантаження та відображення оригінального зображення
    img = load_image('./image.png')  # Шлях до зображення
    plt.figure(figsize=(12, 6))
    
    # Стиснення DCT
    dct_compressed = compress_dct(img, keep_fraction=0.1)
    dct_psnr = psnr(img, dct_compressed)
    
    # Стиснення DWT
    dwt_compressed = compress_dwt(img, keep_fraction=0.1)
    dwt_psnr = psnr(img, dwt_compressed)
    
    # Відображення результатів
    plt.subplot(1, 3, 1)
    plt.title("Original Image")
    plt.imshow(img, cmap='gray')
    
    plt.subplot(1, 3, 2)
    plt.title(f"DCT Compressed (PSNR: {dct_psnr:.2f})")
    plt.imshow(dct_compressed, cmap='gray')
    
    plt.subplot(1, 3, 3)
    plt.title(f"DWT Compressed (PSNR: {dwt_psnr:.2f})")
    plt.imshow(dwt_compressed, cmap='gray')
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
