import pandas as pd
import random
from datetime import datetime, timedelta
import os

# Create a folder to store the output CSV files
output_folder = "relationship_csvs"
os.makedirs(output_folder, exist_ok=True)  # Create the folder if it doesn't exist


# Load CSV files into DataFrames
csv_files = {
    "users": pd.read_csv('MOCK_USERS_MERGED_WITH_UNIQUE_ID.csv'),
    "posts": pd.read_csv('MOCK_POSTS_WITH_UNIQUE_ID.csv'),
    "comments": pd.read_csv('MOCK_COMMENTS_WITH_UNIQUE_ID.csv'),
    "topics": pd.read_csv('MOCK_TOPIC_UNIQUE_WITH_UNIQUE_ID.csv'),
    "countrys": pd.read_csv('MOCK_COUNTRY_WITH_UNIQUE_ID.csv')
}

# Helper function to generate random timestamps
def random_timestamp(start_year=2020, end_year=2023):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    random_seconds = random.randint(0, int((end - start).total_seconds()))
    return (start + timedelta(seconds=random_seconds)).strftime('%Y-%m-%d %H:%M:%S')

# Define relationships based on your JSON schema
relationships = [
      {
      "from": "User",
      "to": "Post",
      "relation_name": "CREATED",
      "attributes": [
        {
          "name": "visibility",
          "type": "string",
          "values": ["public", "private"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        },
        {
          "name": "time_stamp",
          "type": "timeStamp"
        }
      ]
    },
    {
      "from": "User",
      "to": "Post",
      "relation_name": "LIKES",
      "attributes": [
        {
          "name": "browser",
          "type": "string",
          "values": ["Chrome", "Safari"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        },
        {
          "name": "time",
          "type": "timeStamp"
        }
      ]
    },
    {
      "from": "User",
      "to": "Post",
      "relation_name": "DISLIKES",
      "attributes": [
        {
          "name": "time_stamp",
          "type": "timeStamp"
        },
        {
          "name": "browser",
          "type": "string",
          "values": ["Chrome", "Safari"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        }
      ]
    },
    {
      "from": "User",
      "to": "User",
      "relation_name": "FOLLOWS",
      "attributes": [
        {
          "name": "since",
          "type": "date"
        },
        {
          "name": "follow_type",
          "type": "string",
          "values": ["close_friend", "casual"]
        },
        {
          "name": "notifications",
          "type": "bool",
          "values": [True, False]
        }
      ]
    },
    {
      "from": "User",
      "to": "User",
      "relation_name": "BLOCKED",
      "attributes": [
        {
          "name": "time_stamp",
          "type": "timeStamp"
        },
        {
          "name": "reason",
          "type": "string",
          "values": ["offensive", "spam", "not_interested"]
        },
        {
          "name": "is_permanent",
          "type": "bool",
          "values": [True, False]
        }
      ]
    },
    {
      "from": "User",
      "to": "Comment",
      "relation_name": "LIKES",
      "attributes": [
        {
          "name": "browser",
          "type": "string",
          "values": ["Chrome", "Safari"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        },
        {
          "name": "time",
          "type": "timeStamp"
        }
      ]
    },
    {
      "from": "User",
      "to": "Comment",
      "relation_name": "DISLIKES",
      "attributes": [
          {
          "name": "time",
          "type": "timeStamp"
        },
        {
          "name": "browser",
          "type": "string",
          "values": ["Chrome", "Safari"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        }
      ]
    },
    {
      "from": "User",
      "to": "Comment",
      "relation_name": "WROTE",
      "attributes": [
        {
          "name": "time_stamp",
          "type": "timeStamp"
        },
        {
          "name": "language",
          "type": "string",
          "values": ["English", "Spanish", "French", "German"]
        },
        {
          "name": "edited",
          "type": "bool",
          "values": [True, False]
        }
      ]
    },
    {
      "from": "User",
      "to": "Topic",
      "relation_name": "CREATED",
      "attributes": [
        {
          "name": "visibility",
          "type": "string",
          "values": ["public", "private"]
        },
        {
          "name": "source",
          "type": "string",
          "values": ["mobile", "web"]
        },
        {
          "name": "time_stamp",
          "type": "timeStamp"
        }
      ]
    },
    {
      "from": "User",
      "to": "Topic",
      "relation_name": "INTERESTED",
      "attributes": [
        {
          "name": "time_stamp",
          "type": "timeStamp"
        },
        {
          "name": "interest_level",
          "type": "float",
          "min": 1.0,
          "max": 10.0
        },
        {
          "name": "visit_count",
          "type": "int",
          "min": 1,
          "max": 100
        }
      ]
    },
    {
      "from": "User",
      "to": "Country",
      "relation_name": "FROM",
      "attributes": [
        {
          "name": "leftNodeActive",
          "type": "bool",
          "values": [True, False]
        },
        {
          "name": "year",
          "type": "date"
        },
        {
          "name": "day",
          "type": "date"
        }
      ]
    },
    {
      "from": "Post",
      "to": "Topic",
      "relation_name": "RELATED",
      "attributes": [
        {
          "name": "year",
          "type": "date"
        },
        {
          "name": "day",
          "type": "date"
        },
        {
          "name": "relevance",
          "type": "int",
          "min": 1,
          "max": 10
        }
      ]
    },
    {
      "from": "Comment",
      "to": "Post",
      "relation_name": "BELONGS_TO",
      "attributes": [
        {
          "name": "time_stamp",
          "type": "timeStamp"
        },
        {
          "name": "writter_is_active",
          "type": "bool",
          "values": [True, False]
        },
        {
          "name": "is_pinned",
          "type": "bool",
          "values": [True, False]
        }
      ]
    },
    {
      "from": "Topic",
      "to": "Country",
      "relation_name": "FROM",
      "attributes": [
        {
          "name": "leftNodeActive",
          "type": "bool",
          "values": [True, False]
        },
        {
          "name": "year",
          "type": "date"
        },
        {
          "name": "day",
          "type": "date"
        }
      ]
    }
]


# Generate relationship data
data = []

# Generate relationship data for each relationship type
for rel in relationships:
    from_node_type = rel["from"].lower()  # Convert to lowercase (e.g., "User" -> "user")
    to_node_type = rel["to"].lower()      # Convert to lowercase (e.g., "Post" -> "post")
    relation_name = rel["relation_name"]
    
    # Get IDs for "from" and "to" nodes
    from_ids = csv_files[from_node_type + "s"]['id'].tolist()
    to_ids = csv_files[to_node_type + "s"]['id'].tolist()
    
    # Generate random relationships
    data = []
    for _ in range(100):  # Adjust the number of relationships as needed
        from_id = random.choice(from_ids)
        to_id = random.choice(to_ids)
        
        # Generate attributes
        attributes = {}
        for attr in rel["attributes"]:
            if attr["type"] == "string":
                attributes[attr["name"]] = random.choice(attr["values"])
            elif attr["type"] == "bool":
                attributes[attr["name"]] = random.choice([True, False])
            elif attr["type"] == "timeStamp":
                attributes[attr["name"]] = random_timestamp()
            elif attr["type"] == "int":
                attributes[attr["name"]] = random.randint(1, 100)
            elif attr["type"] == "float":
                attributes[attr["name"]] = round(random.uniform(1.0, 10.0), 2)
            elif attr["type"] == "date":
                attributes[attr["name"]] = random_timestamp()[:10]  # Extract date only
        
        # Add relationship to data
        row = {
            "from_node_id": from_id,
            "to_node_id": to_id,
            "relation_name": relation_name,
            **attributes
        }
        data.append(row)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV in the output folder
    output_file = os.path.join(output_folder, f"{from_node_type}_{relation_name}_{to_node_type}.csv")
    df.to_csv(output_file, index=False)
    
    print(f"Generated {len(data)} relationships for {relation_name} and saved to {output_file}")