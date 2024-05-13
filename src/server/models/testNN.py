import pandas as pd

# Load the dataset into a DataFrame
input_file_path = "/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/housing.csv"  # Specify the path to your input CSV file
df = pd.read_csv(input_file_path, header=None, sep='\s+') # Assuming the dataset has no header

# Define column names for the Boston housing dataset
column_names = [
    "CRIM",     # per capita crime rate by town
    "ZN",       # proportion of residential land zoned for lots over 25,000 sq.ft.
    "INDUS",    # proportion of non-retail business acres per town
    "CHAS",     # Charles River dummy variable (1 if tract bounds river; 0 otherwise)
    "NOX",      # nitric oxides concentration (parts per 10 million)
    "RM",       # average number of rooms per dwelling
    "AGE",      # proportion of owner-occupied units built prior to 1940
    "DIS",      # weighted distances to five Boston employment centres
    "RAD",      # index of accessibility to radial highways
    "TAX",      # full-value property-tax rate per $10,000
    "PTRATIO",  # pupil-teacher ratio by town
    "B",        # 1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town
    "LSTAT",    # % lower status of the population
    "MEDV"      # Median value of owner-occupied homes in $1000's
]

print(df.head())
print(df.shape)
# Set column names for the DataFrame
df.columns = column_names
print(df.head())

# Write the DataFrame with updated column names back to a CSV file
output_file_path = "/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/boston.csv"  # Specify the path for the output CSV file
df.to_csv(output_file_path, index=False)

print("CSV file with updated column names has been saved at:", output_file_path)
