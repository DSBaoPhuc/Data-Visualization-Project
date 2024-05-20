import csv
import json


def convert_csv_to_json(csv_file_path, json_file_path):
    # Read the CSV file
    with open(csv_file_path, "r") as csv_file:
        csv_data = csv.DictReader(csv_file)

        # Convert CSV data to a list of dictionaries
        data = []
        for row in csv_data:
            data.append(row)

    # Write the data to a JSON file
    with open(json_file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)


# Provide the paths to your CSV and JSON files
csv_file_path = "Popularity of Programming Languages from 2004 to 2023.csv"
json_file_path = "data.json"

# Call the function to convert the CSV to JSON
convert_csv_to_json(csv_file_path, json_file_path)
