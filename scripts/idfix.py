import pandas as pd

# List of CSV files
files = [
    'MOCK_USERS_MERGED.csv',
    'MOCK_POSTS.csv',
    'MOCK_COMMENTS.csv',
    'MOCK_TOPIC_UNIQUE.csv',
    'MOCK_COUNTRY.csv'
]

# Global counter for unique IDs
id_counter = 1

# Function to generate unique IDs
def generate_unique_id():
    global id_counter
    unique_id = id_counter
    id_counter += 1
    return unique_id

# Process each file
for file in files:
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file)
    
    # Add an 'id' column with unique sequential numbers
    df.insert(0, 'id', [generate_unique_id() for _ in range(len(df))])
    
    # Save the modified DataFrame back to a new CSV file
    output_file = file.replace('.csv', '_WITH_UNIQUE_ID.csv')
    df.to_csv(output_file, index=False)
    
    print(f"Added unique 'id' column to {file} and saved as {output_file}")

print("All files have been processed with unique IDs.")