import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import sys
import json

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
    if (file_path == "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/titanic.csv"):
        X = df_imputed.drop(columns=['Survived'])  # Exclude the target variable
        y = df_imputed['Survived']
    # elif (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/housing_mod.csv'):
    # elif file_path == "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/housing_mod.csv":
    #     boston = load_boston()
    #     X = pd.DataFrame(boston.data, columns=boston.feature_names)
    #     y = pd.Series(boston.target)
    # elif (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'):
    elif file_path == "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/WineQT.csv":
        X = df_imputed.drop(columns=['quality'])
        y = df_imputed['quality']



    # Convert data to PyTorch tensors
    X_tensor = torch.tensor(X.values, dtype=torch.float32)
    y_tensor = torch.tensor(y.values, dtype=torch.float32).unsqueeze(1)  # Add an extra dimension for target

    X_train, X_test, y_train, y_test = train_test_split(X_tensor, y_tensor, test_size=0.2, random_state=42)


    return X_train, y_train, X_test, y_test

def train_model(model, X_train, y_train, criterion, optimizer, num_epochs=1000):
    losses = []
    for epoch in range(num_epochs):
        # Forward pass
        outputs = model(X_train)
        # Compute loss
        loss = criterion(outputs, y_train)
        if (epoch+1) % 10 == 0:
            losses.append(loss.item())
        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        
            

    return losses

def plot_loss(losses):
    plt.plot(np.arange(len(losses)), losses)
    plt.title('Training Loss')
    plt.xlabel('Iterations (x10)')
    plt.ylabel('Loss')
    plt.show()

def get_accuracy(model, X, y):
    with torch.no_grad():
        model.eval()
        y_pred = model(X)
        y_pred = (y_pred > 0.5).float()  # Convert probabilities to binary predictions

    accuracy = accuracy_score(y.numpy(), y_pred.numpy())


import numpy as np

def get_MSE(model, X, y):

    y_pred = model.forward(X)
    mse = nn.MSELoss()(y_pred, y)
    return mse


class CustomNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, num_hidden_layers, activation, classification):
        super(CustomNN, self).__init__()
        self.input_size = input_size
        self.output_size = output_size
        self.hidden_layers = nn.ModuleList([nn.Linear(input_size, hidden_size)])
        self.hidden_layers.extend([nn.Linear(hidden_size, hidden_size) for _ in range(num_hidden_layers-1)])
        self.out = nn.Linear(hidden_size, output_size)
        self.activation = activation
        self.sigmoid = nn.Sigmoid()
        self.classification = classification

    def forward(self, x):
        for layer in self.hidden_layers:
            x = self.activation(layer(x))
        x = self.out(x)
        if (self.classification):
            x = self.sigmoid(x)
        return x

# Function to create neural network based on hyperparameters
def create_nn(input_size, hidden_size, output_size, num_hidden_layers, activation, classification):
    model = CustomNN(input_size, hidden_size, output_size, num_hidden_layers, activation, classification)
    return model

# X_tensor, y_tensor, X_test, y_test = load_data('src/backend/data/WineQT.csv')

# input_size = X_tensor.shape[1]
# hidden_size = 64
# output_size = 1 
# num_hidden_layers = 4
# learning_rate = 0.00001
# activation_function = nn.ReLU()
# classification = False
# iterations = 200

# # Create neural network based on hyperparameters
# model = create_nn(input_size, hidden_size, output_size, num_hidden_layers, activation_function, classification)

# # Define loss function and optimizer
# criterion = nn.MSELoss()
# optimizer = optim.SGD(model.parameters(), lr=learning_rate)

# # Train the model
# losses = train_model(model, X_tensor, y_tensor, criterion, optimizer, num_epochs=iterations)

# # Plot the training loss
# plot_loss(losses)

# if (classification):
#     get_accuracy(model, X_test, y_test)
# else:
#     get_MSE(model, X_test, y_test)


if __name__ == "__main__":
    # Example usage:
    # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'
    file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/WineQT.csv"
    
    # get arguments
    inputs = json.loads(sys.argv[1])
    dataset = inputs["dataset"]
    learning_rate = float(inputs["learning-rate-nn"])
    neurons_per_layer = int(inputs["neurons-per-layer"])
    num_hidden_layers = int(inputs["num-hidden-layers"])

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

    model = create_nn(X_train.shape[1], hidden_size=neurons_per_layer, output_size=1, num_hidden_layers=num_hidden_layers, activation=nn.ReLU(), classification=(dataset == "Titanic Dataset"))

    criterion = nn.MSELoss()
    optimizer = optim.SGD(model.parameters(), lr=learning_rate)

    losses = train_model(model=model, X_train=X_train, y_train=y_train, criterion=criterion, optimizer=optimizer, num_epochs=100)

    mse_test = 5
    print(json.dumps({ "losses": losses, "mse": mse_test}))