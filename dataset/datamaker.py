import random
import csv

def generate_natural_dataset(file_path, num_samples=200):
    # Tingkat hunian (occupancy) dengan variasi angka (kelipatan 2 dan 5)
    occupancy_levels = list(range(20, 100, 2)) + list(range(20, 100, 5))
    occupancy_levels = sorted(set(occupancy_levels))  # Hapus duplikat dan urutkan
    price_ranges = {
        20: (100000, 120000),
        25: (120000, 140000),
        30: (140000, 160000),
        35: (160000, 180000),
        40: (180000, 200000),
        45: (200000, 220000),
        50: (220000, 240000),
        55: (240000, 260000),
        60: (260000, 280000),
        65: (280000, 300000),
        70: (300000, 320000),
        75: (320000, 340000),
        80: (340000, 360000),
        85: (360000, 380000),
        90: (380000, 400000),
        95: (400000, 420000),
    }

    data = []

    # Buat data dengan variasi harga
    for _ in range(num_samples):
        occupancy = random.choice(occupancy_levels)
        min_price, max_price = price_ranges.get((occupancy // 5) * 5, (100000, 500000))
        price = random.randint(min_price, max_price)
        rounded_price = round(price, -3)  # Membulatkan ke ribuan
        data.append({"occupancy": occupancy, "price": rounded_price})

    # Simpan ke file CSV
    with open(file_path, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=["occupancy", "price"])
        writer.writeheader()
        writer.writerows(data)

    print(f"Dataset saved to {file_path}")

# Jalankan fungsi untuk membuat dataset
generate_natural_dataset("occupancy_price_varied_min20.csv")
