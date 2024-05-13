import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
import json
import sys
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

class LinearRegressionModel(nn.Module):
    def __init__(self, input_dim):
        super(LinearRegressionModel, self).__init__()
        self.linear = nn.Linear(input_dim, 1)

    def forward(self, x):
        return self.linear(x)

def load_data(file_path):
    # Load data from file
    df = pd.read_csv(file_path)

    # Drop non-numerical columns
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    df_numeric = df[numerical_cols]

    zero_var_cols = df_numeric.columns[df_numeric.var() == 0]
    df_numeric = df_numeric.drop(columns=zero_var_cols)

    df_imputed = df_numeric.fillna(df_numeric.mean())

    # if (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/titanic.csv'):
    if file_path == "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/titanic.csv":
        X = df_imputed.drop(columns=['Survived'])
        y = df_imputed['Survived']
    elif (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/boston.csv'):
        X = df_imputed.drop(columns=['MEDV'])
        y = df_imputed['MEDV']
    elif (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'):
        X = df_imputed.drop(columns=['quality'])
        y = df_imputed['quality']

    # Convert data to PyTorch tensors
    X_tensor = torch.tensor(X.values, dtype=torch.float32)
    y_tensor = torch.tensor(y.values, dtype=torch.float32).unsqueeze(1)

    X_train, X_test, y_train, y_test = train_test_split(X_tensor, y_tensor, test_size=0.2, random_state=42)

    return X_train, y_train, X_test, y_test

def train_model(X_train, y_train, learning_rate, iterations):
    input_dim = X_train.shape[1]
    model = LinearRegressionModel(input_dim)
    criterion = nn.MSELoss()
    optimizer = optim.SGD(model.parameters(), lr=learning_rate)

    loss_values = []
    for epoch in range(iterations):
        # Forward pass
        outputs = model(X_train)
        loss = criterion(outputs, y_train)

        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        

        if (epoch+1) % 10 == 0:
            loss_values.append(loss.item())

    return model, loss_values

def plot_loss_curve(loss_values):
    plt.plot(loss_values, label='Training Loss')
    plt.xlabel('Iterations')
    plt.ylabel('Loss')
    plt.title('Training Loss Curve')
    plt.legend()
    plt.show()

def calculate_mse(model, X_test, y_test):
    criterion = nn.MSELoss()
    with torch.no_grad():
        outputs = model(X_test)
        mse = criterion(outputs, y_test)
    return mse.item()


if __name__ == "__main__":
    # Example usage:
    # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'
    file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/WineQT.csv"
    
    # get arguments
    inputs = json.loads(sys.argv[1])
    dataset = inputs["dataset"]
    learning_rate = float(inputs["learning-rate"])
    iterations = int(inputs["num-iterations"])
    
    if (dataset == "Boston Housing Dataset"):
        # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/housing_mod.csv'
        file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/housing_mod.csv"
    elif (dataset == "Wine Quality Dataset"):
        # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'
        file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/WineQT.csv"
    else:
        # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/titanic.csv'
        file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/titanic.csv"

    X_train, y_train, X_test, y_test = load_data(file_path)
    model, losses = train_model(X_train, y_train, learning_rate, iterations)

    mse_test = calculate_mse(model, X_test, y_test)
    print(json.dumps({ "losses": losses, "mse": mse_test}))