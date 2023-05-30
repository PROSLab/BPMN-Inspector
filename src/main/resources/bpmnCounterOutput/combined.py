import csv
import os
from collections import defaultdict
from itertools import combinations

# Percorso del file CSV
script_path = os.path.abspath(__file__)

# Crea il percorso completo del file CSV relativo allo script corrente
input_file = os.path.join(os.path.dirname(script_path), "bpmn_combinedSets.csv")
output_file = os.path.join(os.path.dirname(script_path), "bpmn_combinedSets_output.csv")

# Dizionario per il conteggio delle combinazioni di elementi
combination_counts = defaultdict(int)

# Numero massimo di elementi da considerare
max_elements = 10

# Leggi il file CSV e calcola i conteggi delle combinazioni di elementi
with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    header = next(reader)  # Salta l'header

    # Calcola gli indici delle colonne per gli elementi sulla riga corrente
    element_indices = [i for i, cell in enumerate(header) if cell not in ['']]

    # Calcola i conteggi delle combinazioni di elementi per ogni riga
    rows = list(reader)  # Leggi tutte le righe


# Calcola i conteggi delle combinazioni di elementi per ogni riga
for row in rows:
    row_elements = [header[i] for i in element_indices if i < len(row) and row[i].isdigit() and int(row[i]) > 0]

    # Genera tutte le possibili combinazioni di elementi
    for r in range(2, min(max_elements + 1, len(row_elements) + 1)):
        combinations_r = combinations(row_elements, r)
        combinations_list = list(combinations_r)

        # Incrementa il conteggio per ogni combinazione di elementi
        for combination in combinations_list:
            combination_counts[combination] += 1


total_models = len(rows)
print(total_models)
# Trova l'elemento successivo da aggiungere alla combinazione corrente
def find_next_element(current_combination, combination_counts, header):
    elements_in_combination = set(current_combination)
    remaining_elements = set(header) - elements_in_combination

    # Copia il dizionario combination_counts per evitare problemi di dimensioni che cambiano durante l'iterazione
    combination_counts_copy = combination_counts.copy()

    # Calcola il conteggio totale di ogni elemento in ogni colonna
    element_counts = {element: sum(combination_counts.get(combination, 0) for combination in combination_counts_copy if element in combination) for element in remaining_elements}

    # Seleziona l'elemento con il conteggio più alto
    next_element = max(element_counts, key=element_counts.get)
    return next_element

# Trova la combinazione con la percentuale più alta per ogni lunghezza
max_percentage_combinations = []

# Combinazione di elementi >1 con la percentuale più alta
max_count = 0
max_combination = None
for combination, count in combination_counts.items():
    if len(combination) > 1 and count > max_count:
        max_count = count
        max_combination = combination

if max_combination:
    max_percentage_combinations.append(max_combination)

for i in range(2, 10):
    previous_combination = max_percentage_combinations[-1] if max_percentage_combinations else None
    max_count = 0
    max_combination = None
    for combination, count in combination_counts.items():
        if len(combination) > i and previous_combination and set(previous_combination).issubset(set(combination)) and count > max_count:
            max_count = count
            max_combination = combination

    if max_combination:
        max_percentage_combinations.append(max_combination)
'''
# Stampa le combinazioni con le percentuali più alte
for combination in max_percentage_combinations:
    count = combination_counts[combination]
    percentage = count / total_models * 100
    print("Elementi:", combination)
    print("Count:", count)
    print("Total Models:", total_models)
    print("Risultato:", percentage)
    print("-----------------------")
'''

with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=';')

    # Scrivi le combinazioni con le percentuali più alte nel file di output
    for combination in max_percentage_combinations:
        count = combination_counts[combination]
        percentage = count / total_models * 100
        writer.writerow([' - '.join(combination), "{:.2f}%".format(percentage)])
