
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
import json


def load_data(file_path):
    df = pd.read_csv(file_path)

    # Drop non-numerical columns
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    df_numeric = df[numerical_cols]

    zero_var_cols = df_numeric.columns[df_numeric.var() == 0]
    df_numeric = df_numeric.drop(columns=zero_var_cols)

    df_imputed = df_numeric.fillna(df_numeric.mean())

    # if file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/titanic.csv':
    if file_path == "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/titanic.csv":
        X = df_imputed.drop(columns=['Survived'])
        y = df_imputed['Survived']
    elif (file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/boston.csv'):
        X = df_imputed.drop(columns=['MEDV'])
        y = df_imputed['MEDV']
    elif file_path == '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv':
        X = df_imputed.drop(columns=['quality'])
        y = df_imputed['quality']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    return X_train, y_train, X_test, y_test

def train_model(X_train, y_train, criterion='gini', splitter='best', max_depth=None, min_samples_split=2, classification="false"):
    if (classification):
        model = DecisionTreeClassifier(criterion=criterion, splitter=splitter, max_depth=max_depth, min_samples_split=min_samples_split)
    else:
        model = DecisionTreeRegressor(criterion='mse', splitter=splitter, max_depth=max_depth, min_samples_split=min_samples_split)
    model.fit(X_train, y_train)


    return model

def plot_learning_curve(train_sizes, train_scores, val_scores, title, ylabel):
    plt.figure()
    plt.title(title)
    plt.xlabel("Number of Training Samples")
    plt.ylabel(ylabel)
    plt.grid()

    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    val_mean = np.mean(val_scores, axis=1)
    val_std = np.std(val_scores, axis=1)

    plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color="r")
    plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_mean, 'o-', color="r", label="Training Score")
    plt.plot(train_sizes, val_mean, 'o-', color="g", label="Validation Score")

    plt.legend(loc="best")
    plt.show()


def generate_learning_curve(X_train, y_train, X_val, y_val, model, title, ylabel):
    train_sizes = np.linspace(0.1, 1.0, 10)
    train_sizes = np.int_(np.ceil(train_sizes * len(X_train)))

    train_scores = []
    val_scores = []

    for train_size in train_sizes:
        model.fit(X_train[:train_size], y_train[:train_size])

        train_pred = model.predict(X_train[:train_size])
        train_score = accuracy_score(y_train[:train_size], train_pred) if isinstance(model, DecisionTreeClassifier) else mean_squared_error(y_train[:train_size], train_pred)
        train_scores.append([train_score])  # Append the score as a list

        val_pred = model.predict(X_val)
        val_score = accuracy_score(y_val, val_pred) if isinstance(model, DecisionTreeClassifier) else mean_squared_error(y_val, val_pred)
        val_scores.append([val_score])  # Append the score as a list

    plot_learning_curve(train_sizes, np.array(train_scores), np.array(val_scores), title, ylabel)
    return train_scores, val_scores, train_sizes



def evaluate_model(model, X_test, y_test):
    if isinstance(y_test.iloc[0], str):
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        return accuracy
    else:
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        return mse


def build_decision_tree(X_train, y_train, criterion='gini', splitter='best', max_depth=None, min_samples_split=2):
    
    clf = DecisionTreeClassifier(criterion=criterion, splitter=splitter, max_depth=max_depth, min_samples_split=min_samples_split)
    clf.fit(X_train, y_train)
    return clf



# X_train, y_train, X_test, y_test = load_data('src/backend/data/WineQT.csv')
# model, losses = train_model(X_train, y_train, 1000, criterion='mse', max_depth=5, min_samples_split=10)
# evaluate_model(model, X_test, y_test)
# generate_learning_curve(X_train=X_train, y_train=y_train, X_val=X_test, y_val=y_test, model=model, title="Learning curve", ylabel="something")



if __name__ == "__main__":
    # Example usage:
    # file_path = '/Users/luketaylor/Desktop/CS326/Project/326_Education_App/src/server/data/WineQT.csv'
    file_path = "/Users/shoubhitravi/Shoubhit's Documents/Semester 4/CS 326/Education_App/326_Education_App/src/server/data/WineQT.csv"
    
    # get arguments
    inputs = json.loads(sys.argv[1])
    dataset = inputs["dataset"]
    criterion = inputs["criterion"]
    max_depth = int(inputs["max-depth"])
    min_samples_split = int(inputs["min-samples-split"])
    classification = (dataset == "Titanic Dataset")

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

    model = train_model(X_train, y_train, criterion=criterion, max_depth=max_depth, min_samples_split=min_samples_split, classification=classification)

    train_scores, val_scores, train_sizes = generate_learning_curve(X_train=X_train, y_train=y_train, X_val=X_test, y_val=y_test, model=model, title="graph", ylabel="idk")

    result = evaluate_model(model, X_test=X_test, y_test=y_test)
    print(json.dumps({ "train_scores": train_scores, "val_scores": val_scores, "result": result, "train_sizes": train_sizes.tolist() }))