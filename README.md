# MLSquared

Welcome to MLSquared, a comprehensive learning platform geared towards data scientists of all levels, from beginners to those already in the field. MLSquared is a high-quality, user-friendly, and free application with the goal of increasing educational equity by making it accessible for anyone with an internet connection to learn about data analysis and machine learning. We especially made our platform easy to understand and simple to navigate, demystifying the process of modeling data for anyone who has ever wanted to try.  

MLSquared offers three interesting datasets, a training module that encourages users to get creative with their models, and a leaderboard that tracks and compares model performance, and allows users to leave their thoughts in comments on the entries. 

## Project Structure

Below is an overview of the key directories and files within the ML Squared project repository:
```
/326_EDUCATION_APP
│
├── Data                     # Contains various datasets
│
├── node_modules             # Node.js packages (not tracked by Git)
│
├── src                      # Source files for the application
│   ├── client               # Client-side code
│   │   ├── db.js            # Database interaction scripts
│   │   ├── github.txt       # GitHub configuration (likely should be .gitignored)
│   │   ├── index.html       # Main HTML document
│   │   ├── script.js        # Client-side JavaScript
│   │   └── styles.css       # Stylesheet for the application
│   │
│   ├── server               # Server-side code
│   │   ├── data             # Data files for server use
│   │   │   ├── boston.csv   # Dataset for Boston housing
│   │   │   ├── housing_mod.csv  # Modified housing dataset
│   │   │   ├── housing.csv  # Original housing dataset
│   │   │   ├── titanic.csv  # Dataset for Titanic passengers
│   │   │   └── WineQT.csv   # Wine quality dataset
│   │   │
│   │   ├── models          # Machine learning models
│   │   │   ├── decision.py  # Decision tree model
│   │   │   ├── lin_reg.py   # Linear regression model
│   │   │   ├── nn.py        # Neural network model
│   │   │   └── testNN.py    # Test script for neural networks
│   │   │
│   │   ├── backend.js      # Backend utility functions
│   │   └── server.js       # Node.js server setup
│   │
│   └── training.js         # Script for training models
│
├── docs                     # Documentation files
│   └── milestone-01         # Documentation for milestone 1
│
├── .gitignore               # Specifies intentionally untracked files to ignore
├── package.json             # NPM package and dependency definitions
├── package-lock.json        # Locked versions of the package dependencies
└── README.md                # Project documentation

```

## Setup Instructions

To get the ML Squared platform running locally, follow these steps:

### Prerequisites

- Node.js (version 12.x or later)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/326_EDUCATION_APP.git
cd 326_EDUCATION_APP

```

2. Install dependencies

```
npm install
```

Make sure you have python3 and that all of the needed dependencies from python are installed. You can see what is needed at the top of the four Python files:

```
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
import json
```

```
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
import json
import sys
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
```

```
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
```

```
import pandas as pd
```


3. Change file paths

You will need to change the file paths in `server.js`, and in all Python files in the `models` directory. 

In `server.js`, on line 37, the following code accesses Python in your computer:

```
const pythonProcess = spawn('/usr/local/bin/python3', [file_path, JSON.stringify(inputs)]
```

Change `/usr/local/bin/python3` to the corresponding path for you. If you are on a Windows computer, you will need to change it. 


Within all the Python files, search for the variable `file_path`. Change all occurrences of the path to the correct absolute path, which you can see in the terminal.

For example:

```
/Users/yourName/Downloads/MLSquared/src/server/data/titanic.csv
```

3. Start the server

Navigate to `src`, then the `server` directory. Start the server:

```
node --experimental-modules server.js
```

This will run the development server on `http://localhost:3000/`. 

4. Open MLSquared on your browser

Navigate to `http://localhost:3000/` on your preferred web browser. 


## Navigating the Application

- **Home**: Overview of what ML Squared offers, including a button that directs user to choosing a dataset.
- **Datasets**: Explore and select datasets to use for training and testing data analysis models.
- **Leaderboard**: View and compare the performance of different models and parameter values, based on metrics of loss. Click on the arrow to view more details and leave a comment. 
- **Training**: Interactive training module to learn and practice data science skills. User can also select dataset here from the dropdown menu. Choose model type, which will populate with corresponding hyperparameters that can be adjusted by the user. By pressing the "Start Training" button, the page will display a graph of the model's progress of loss over time. Results can then be shared to the leaderboard, which will prompt user to fill out a form detailing their experience below the results of their model. 
