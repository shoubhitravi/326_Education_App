from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
import numpy as np
import matplotlib.pyplot as plt

class LinearRegression:
    def __init__(self, learning_rate=0.01, num_iterations=1000):
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.random.rand(n_features)
        self.bias = 0

        for _ in range(self.num_iterations):
            y_pred = self.predict(X)
            dw = (1 / n_samples) * np.dot(X.T, (y_pred - y))
            db = (1 / n_samples) * np.sum(y_pred - y)

            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

    def predict(self, X):
        y_pred = np.dot(X, self.weights) + self.bias
        return y_pred

# # Test with fake data
# X = np.array([[1], [3], [5], [7], [9]])
# y = np.array([2, 6, 12, 12, 20])

# # Create an instance of CustomLinearRegression with specified hyperparameters
# model = LinearRegression(learning_rate=0.0001, num_iterations=1000)

# # Fit the model
# model.fit(X, y)

# # Print the coefficients
# print("Coefficients:", model.weights)

# # Make predictions
# X_new = np.array([[11], [13], [15]])
# predictions = model.predict(X_new)
# print("Predictions:", predictions)

# x_line = np.linspace(X[:, 0].min(), X[:, 0].max(), 100)
# y_line = model.weights[0] * x_line + model.bias


# # Plot the data and the fitted line
# plt.figure(figsize=(8, 6))
# plt.scatter(X[:, 0], y, label='Data')  # Use X[:, 0] for x-coordinates
# plt.plot(x_line, y_line, color='red', label='Fitted Line')
# plt.xlabel('X')
# plt.ylabel('y')
# plt.title('Custom Linear Regression')
# plt.legend()
# plt.show()

# Test with Boston Housing Dataset
boston = load_boston()

# Define features and target variable
X = boston.data
y = boston.target

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression(learning_rate=0.0001, num_iterations=5)

# Fit the model
model.fit(X_train, y_train)

# Make predictions on test set
predictions = model.predict(X_test)


# Calculate MSE (Mean Squared Error)
mse = np.mean((predictions - y_test) ** 2)
print("Mean Squared Error:", mse)


# Plot the predictions vs. actual values
plt.scatter(y_test, predictions)
plt.xlabel("Actual Prices")
plt.ylabel("Predicted Prices")
plt.title("Predicted Prices vs. Actual Prices")
plt.show()