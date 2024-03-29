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
filename = os.path.join(current_dir, "bpmn_combined.csv")

if len(df) <= 1:
    exit()

# Trova gli elementi che sono presenti almeno una volta nel dataset
present_elements = df.columns[df.any()].tolist()

header = present_elements.copy()
header.insert(0, '')

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
        rounded_rho_element_list = [round(rho, 2) for rho in rho_element_list]
        csvwriter.writerow([element] + rounded_rho_element_list)
