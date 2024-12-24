import pandas as pd
import numpy as np

def generate_hotel_data(num_rows=100):
  """
  Generates a DataFrame with specified number of rows for hotel occupancy and price.

  Args:
    num_rows: The number of rows to generate.

  Returns:
    A pandas DataFrame containing the generated data.
  """

  # Create an empty DataFrame
  data = {'Tanggal': pd.date_range(start='2023-01-01', periods=num_rows),
          'Tingkat Hunian (%)': np.random.randint(50, 100, size=num_rows),
          'Harga Rata-rata (Rp)': np.random.randint(500000, 1500000, size=num_rows)}

  # Ensure a strong positive correlation between occupancy and price
  data['Harga Rata-rata (Rp)'] = data['Tingkat Hunian (%)'] * 5000 + np.random.randint(-100000, 100000, size=num_rows)

  df = pd.DataFrame(data)
  return df

# Generate and save the DataFrame
df = generate_hotel_data(100)
df.to_csv('hotel_data_simplified.csv', index=False)

print("Data telah disimpan dalam file hotel_data_simplified.csv")