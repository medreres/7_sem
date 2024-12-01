import numpy as np
import cv2
import pywt
from skimage.metrics import peak_signal_noise_ratio as psnr
import matplotlib.pyplot as plt
import os

# # Функція для виконання 2D DCT (дискретного косинусного перетворення)
# def dct2(block):
#     """
#     Реалізація 2D DCT (Дискретне Косинусне Перетворення) для блоку.
    
#     Parameters:
#         block (numpy.ndarray): Вхідний блок розміром NxN.
        
#     Returns:
#         numpy.ndarray: Результат 2D DCT.
#     """
#     N = block.shape[0]  # Припускаємо, що блок квадратний NxN
#     M = block.shape[1]
    
#     # Ініціалізація матриці результатів
#     dct_result = np.zeros((N, M), dtype=np.float32)
    
#     # Обчислення DCT для кожного коефіцієнта (u, v)
#     for u in range(N):
#         for v in range(M):
#             # Обчислення коефіцієнтів альфа
#             alpha_u = np.sqrt(1 / N) if u == 0 else np.sqrt(2 / N)
#             alpha_v = np.sqrt(1 / M) if v == 0 else np.sqrt(2 / M)
            
#             # Сума по всіх (x, y)
#             sum_value = 0
#             for x in range(N):
#                 for y in range(M):
#                     sum_value += (
#                         block[x, y] *
#                         np.cos((2 * x + 1) * u * np.pi / (2 * N)) *
#                         np.cos((2 * y + 1) * v * np.pi / (2 * M))
#                     )
            
#             # Результуючий коефіцієнт
#             dct_result[u, v] = alpha_u * alpha_v * sum_value
    
#     return dct_result

def dct2(block):
    return cv2.dct(block.astype(np.float32))  # Застосовуємо DCT до блоку, перетворюючи його на тип float32 для коректного обчислення


# # Функція для виконання 2D IDCT (зворотне дискретне косинусне перетворення)
# def idct2(block):
#     """
#     Реалізація 2D IDCT (Обернене Дискретне Косинусне Перетворення) для блоку.
    
#     Parameters:
#         block (numpy.ndarray): Вхідний блок з коефіцієнтами DCT розміром NxN.
        
#     Returns:
#         numpy.ndarray: Відновлений блок зображення.
#     """
#     N = block.shape[0]  # Припускаємо, що блок квадратний NxN
#     M = block.shape[1]
    
#     # Ініціалізація матриці результатів
#     idct_result = np.zeros((N, M), dtype=np.float32)
    
#     # Обчислення IDCT для кожного пікселя (x, y)
#     for x in range(N):
#         for y in range(M):
#             # Сума по всіх (u, v)
#             sum_value = 0
#             for u in range(N):
#                 for v in range(M):
#                     # Обчислення коефіцієнтів альфа
#                     alpha_u = np.sqrt(1 / N) if u == 0 else np.sqrt(2 / N)
#                     alpha_v = np.sqrt(1 / M) if v == 0 else np.sqrt(2 / M)
                    
#                     # Додати внесок від кожного частотного коефіцієнта
#                     sum_value += (
#                         alpha_u * alpha_v * block[u, v] *
#                         np.cos((2 * x + 1) * u * np.pi / (2 * N)) *
#                         np.cos((2 * y + 1) * v * np.pi / (2 * M))
#                     )
            
#             # Зберігаємо результат
#             idct_result[x, y] = sum_value
    
#     return idct_result

def idct2(block):
    return cv2.idct(block)  # Застосовуємо IDCT до блоку для відновлення зображення з коефіцієнтів DCT

# Функція стиснення з використанням DCT
def dct_compression(image, keep_coeff=10):
    image = image.astype(np.float32)  # Перетворюємо зображення у формат float32 для обробки DCT
    h, w = image.shape  # Отримуємо висоту (h) та ширину (w) зображення
    compressed_image = np.zeros_like(image, dtype=np.float32)  # Створюємо порожній масив для стисненого зображення

    # Обробка зображення блоками розміром 8x8
    for i in range(0, h, 8):
        for j in range(0, w, 8):
            block = image[i:i+8, j:j+8]  # Витягуємо блок розміром 8x8 з зображення
            dct_block = dct2(block)  # Застосовуємо DCT до блоку
            dct_block[keep_coeff:, keep_coeff:] = 0  # Обнуляємо високочастотні коефіцієнти (крок стиснення)
            compressed_image[i:i+8, j:j+8] = idct2(dct_block)  # Відновлюємо блок за допомогою IDCT і записуємо його в зображення

    return compressed_image  # Повертаємо стиснуте зображення

# def wavelet_compression(image, level=1):
#     """
#     Performs wavelet-based image compression.

#     Args:
#         image: The input image as a NumPy array.
#         level: The level of wavelet decomposition.

#     Returns:
#         The compressed image.
#     """

#     # Simplified 2D Haar wavelet decomposition
#     def haar_2d(image, level):
#         for _ in range(level):
#             # Horizontal decomposition
#             image = np.vstack((
#                 (image[0::2, :] + image[1::2, :]) / np.sqrt(2),
#                 (image[0::2, :] - image[1::2, :]) / np.sqrt(2)
#             ))

#             # Vertical decomposition
#             image = np.hstack((
#                 (image[:, 0::2] + image[:, 1::2]) / np.sqrt(2),
#                 (image[:, 0::2] - image[:, 1::2]) / np.sqrt(2)
#             ))
#         return image

#     # Simplified thresholding
#     def threshold(coeffs, threshold_value):
#         coeffs[np.abs(coeffs) < threshold_value] = 0
#         return coeffs

#     # Wavelet decomposition
#     coeffs = haar_2d(image, level)

#     # Thresholding
#     threshold_value = np.max(np.abs(coeffs)) * 0.2
#     coeffs = threshold(coeffs, threshold_value)

#     # Inverse wavelet transform (simplified)
#     image_compressed = haar_2d(coeffs, -level)

#     return image_compressed

# Функція стиснення з використанням вейвлетів (Хаар)
def wavelet_compression(image, level=1):
    coeffs = pywt.wavedec2(image, 'haar', level=level)  # Застосовуємо 2D дискретне вейвлет-перетворення до зображення
    # Поріг для коефіцієнтів вейвлету (залишаємо найбільш значущі коефіцієнти)
    coeffs_compressed = [coeffs[0]] + [tuple(pywt.threshold(c, value=np.max(c)*0.2, mode='soft') for c in coeff) for coeff in coeffs[1:]]
    return pywt.waverec2(coeffs_compressed, 'haar')  # Відновлюємо

# Функція для обчислення PSNR (піксельного співвідношення сигнал/шум) для оцінки якості стиснення
def compute_psnr(original, compressed):
    return psnr(original, compressed)  # Обчислюємо PSNR між оригінальним і стиснутим зображенням

# Function to save the image to disk and get the file size
def calculate_image_size(image, filename='temp_image.png'):
    cv2.imwrite(filename, image)  # Save the image to disk (you can change the format to 'jpg', 'png', etc.)
    file_size = os.path.getsize(filename)  # Get the size of the file in bytes
    os.remove(filename)  # Optionally, remove the temporary file after checking the size
    return file_size  # Return the file size in bytes

# Основна функція
def main():
    image = cv2.imread('image1.jpg', cv2.IMREAD_GRAYSCALE)  # Завантажуємо зображення в градаціях сірого

    # Застосовуємо стиснення за допомогою DCT
    dct_result = dct_compression(image, keep_coeff=10)

    # Застосовуємо стиснення за допомогою вейвлетів
    wavelet_result = wavelet_compression(image, level=2)

    # Обчислюємо PSNR для обох стиснених зображень
    psnr_dct = compute_psnr(image, dct_result)  # Обчислюємо PSNR для стиснутого зображення DCT
    psnr_wavelet = compute_psnr(image, wavelet_result)  # Обчислюємо PSNR для стиснутого зображення Wavelet

    # Обчислюємо розміри оригінального та стиснених зображень
    original_size = calculate_image_size(image)  # Отримуємо розмір оригінального зображення
    dct_size = calculate_image_size(dct_result)  # Отримуємо розмір стисненого зображення DCT
    wavelet_size = calculate_image_size(wavelet_result)  # Отримуємо розмір стисненого зображення Wavelet

    # Виводимо порівняння розмірів зображень в KB
    print(f"Original image size: {original_size / 1024:.2f} KB")  # Виводимо розмір оригінального зображення в KB
    print(f"DCT compressed image size: {dct_size / 1024:.2f} KB")  # Виводимо розмір стисненого зображення DCT в KB
    print(f"Wavelet compressed image size: {wavelet_size / 1024:.2f} KB")  # Виводимо розмір стисненого зображення Wavelet в KB

    # Побудова графіка для порівняння результатів
    plt.figure(figsize=(12, 6))  # Налаштовуємо фігуру для побудови зображень
    plt.subplot(1, 3, 1)  # Створюємо підграфік для оригінального зображення
    plt.title("Original")  # Назва для оригінального зображення
    plt.imshow(image, cmap='gray')  # Відображаємо оригінальне зображення в градаціях сірого
    plt.subplot(1, 3, 2)  # Створюємо підграфік для стисненого зображення DCT
    plt.title(f"DCT (PSNR: {psnr_dct:.2f} dB)")  # Назва для стисненого зображення DCT з PSNR
    plt.imshow(dct_result, cmap='gray')  # Відображаємо стиснене зображення DCT
    plt.subplot(1, 3, 3)  # Створюємо підграфік для стисненого зображення Wavelet
    plt.title(f"Wavelet (PSNR: {psnr_wavelet:.2f} dB)")  # Назва для стисненого зображення Wavelet з PSNR
    plt.imshow(wavelet_result, cmap='gray')  # Відображаємо стиснене зображення Wavelet
    plt.tight_layout()  # Автоматично коригуємо макет, щоб уникнути перекриття підграфіків
    plt.show()  # Відображаємо побудований графік

# Запуск основної функції
if __name__ == "__main__":
    main()  # Викликаємо основну функцію для виконання програми
