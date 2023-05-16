import numpy as np
import os
import csv
import time
import matplotlib.pyplot as plt
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))
csv_file = os.path.join(current_dir, 'bpmn_elements.csv')
df = pd.read_csv(csv_file, low_memory=False, delimiter=";", encoding="ISO-8859-1", index_col=False)
df = df.iloc[:, 2:-7]
np.seterr(divide='ignore', invalid='ignore')
filename = os.path.join(current_dir, "bpmn_combined.csv")
header = df.columns.values.tolist()
header.insert(0, '\\')

if len(df) <= 1:
    print("Only one model is present")
    exit()

# Trova gli elementi che sono presenti almeno una volta nel dataset
present_elements = df.columns[df.any()].tolist()

with open(filename, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(header)

for index, element in enumerate(present_elements):
    rho_element_list = []
    x_df = np.array(df.loc[0:, element])
    for index2, element2 in enumerate(present_elements):
        y_df = np.array(df.loc[0:, element2])
        my_rho = np.corrcoef(x_df, y_df)
        currentRho = my_rho[1][0]
        rho_element_list.append(currentRho)
    with open(filename, 'a', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow([element] + rho_element_list)