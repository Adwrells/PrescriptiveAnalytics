import { KnapsackItem } from '../types';

export const generatePythonCode = (items: KnapsackItem[], capacity: number): string => {
  const weights = items.map(i => i.weight);
  const values = items.map(i => i.value);
  
  // OR-Tools requires weights to be a list of lists (for multi-dimensional support)
  // Even for 1D, it must be [[w1, w2, ...]]
  const weightsString = `[${weights.join(', ')}]`;
  const valuesString = `[${values.join(', ')}]`;
  
  // Create a mapping comment for the user to understand the index output
  const itemMapping = items.map((item, index) => `    # Item ${index}: ${item.name} (Value: ${item.value}, Weight: ${item.weight})`).join('\n');

  return `
# Google OR-Tools Knapsack Solver - Python Solution
# Auto-generated based on your specific inputs

import sys

# Prerequisite: Install the Google OR-Tools library
# Run in terminal: pip install ortools

try:
    from ortools.algorithms.python import knapsack_solver
except ImportError:
    print("Error: OR-Tools not found. Please run: pip install ortools")
    sys.exit(1)

def solve_knapsack_ortools():
    # Initialize the solver using the Branch and Bound algorithm
    # This is typically the most efficient for 0/1 Knapsack problems
    solver = knapsack_solver.KnapsackSolver(
        knapsack_solver.SolverType.KNAPSACK_MULTIDIMENSION_BRANCH_AND_BOUND_SOLVER,
        'KnapsackExample'
    )

    # --- Data Configuration (From App) ---
    # Capacities (List containing capacity for each dimension)
    capacities = [${capacity}]

    # Values (Profit for each item)
    values = ${valuesString}

    # Weights (List of lists: [ [w_0, w_1, ...] ])
    weights = [${weightsString}]

    # Validate input lengths
    if len(values) != len(weights[0]):
        print("Error: Mismatch between values and weights count")
        return

    # Initialize the solver with the data
    solver.init(values, weights, capacities)

    # Compute the optimal solution
    computed_value = solver.solve()

    # --- Output Results ---
    print(f"Optimal Value: {computed_value}")
    
    packed_items = []
    packed_weights = []
    total_weight = 0

    print("\\nSelected Items:")
    # Check each item to see if it was included in the optimal solution
    for i in range(len(values)):
        if solver.best_solution_contains(i):
            packed_items.append(i)
            packed_weights.append(weights[0][i])
            total_weight += weights[0][i]
            print(f" - Item Index {i} (Weight: {weights[0][i]}, Value: {values[i]})")

    print(f"\\nTotal Weight: {total_weight} / {capacities[0]}")
    
    # --- Item Reference Map ---
    """
${itemMapping}
    """

if __name__ == '__main__':
    solve_knapsack_ortools()
`;
};