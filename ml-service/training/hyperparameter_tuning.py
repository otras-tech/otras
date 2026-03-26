# training/hyperparameter_tuning.py

from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestRegressor


def tune_model(X_train, y_train):

    print("Starting hyperparameter tuning...")

    param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [5, 10, None],
        "min_samples_split": [2, 5],
        "min_samples_leaf": [1, 2]
    }

    base_model = RandomForestRegressor(random_state=42)

    grid_search = GridSearchCV(
        estimator=base_model,
        param_grid=param_grid,
        cv=3,
        n_jobs=-1,
        verbose=1
    )

    grid_search.fit(X_train, y_train)

    print("\nBest Parameters Found:")
    print(grid_search.best_params_)

    best_model = grid_search.best_estimator_

    return best_model
