import pandas as pd

# Load the CSV files into DataFrames
df1 = pd.read_csv('MOCK_USERS1.csv')
df2 = pd.read_csv('MOCK_USERS2.csv')
df3 = pd.read_csv('MOCK_USERS3.csv')

# Combine all DataFrames into one
combined_df = pd.concat([df1, df2, df3])

# Remove duplicates based on the 'user_name' column
# Keep the first occurrence of each duplicate
unique_df = combined_df.drop_duplicates(subset='user_name', keep='first')
print(unique_df.shape)

# Save the merged and deduplicated DataFrame to a new CSV file
unique_df.to_csv('MOCK_USERS_MERGED.csv', index=False)

print("CSV files merged and duplicates removed successfully!")

import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('MOCK_TOPIC.csv')

# Track occurrences of each name
name_counts = {}

# Function to make names unique
def make_unique(name):
    if name in name_counts:
        name_counts[name] += 1
        return f"{name}_{name_counts[name]}"
    else:
        name_counts[name] = 0
        return name

# Apply the function to the 'name' column
df['name'] = df['name'].apply(make_unique)

# Save the modified DataFrame to a new CSV file
df.to_csv('MOCK_TOPIC_UNIQUE.csv', index=False)

print("Names made unique and saved to MOCK_TOPIC_UNIQUE.csv!")