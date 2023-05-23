import csv
from collections import defaultdict
from itertools import combinations

# Percorso del file CSV
input_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets.csv"
output_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets.csv"

# Dizionario per il conteggio delle combinazioni di elementi
combination_counts = defaultdict(int)

# Numero massimo di elementi da considerare
max_elements = 5

# Leggi il file CSV e calcola i conteggi delle combinazioni di elementi
with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    header = next(reader)  # Salta l'header

    # Calcola gli indici delle colonne per gli elementi sulla riga corrente
    element_indices = [i for i, cell in enumerate(header) if cell not in ['']]

    # Calcola i conteggi delle combinazioni di elementi per ogni riga
    total_models = 0
    for row in reader:
        row_elements = [header[i] for i in element_indices if i < len(row) and row[i].isdigit() and int(row[i]) > 0]

        # Genera tutte le possibili combinazioni di elementi
        for r in range(2, min(max_elements + 1, len(row_elements) + 1)):
            combinations_r = combinations(row_elements, r)
            combinations_list = list(combinations_r)

            # Incrementa il conteggio per ogni combinazione di elementi
            for combination in combinations_list:
                combination_counts[combination] += 1

        total_models += 1

# Calcola la percentuale di presenza per ogni combinazione di elementi
combination_percentages = {combination: count / total_models * 100 for combination, count in combination_counts.items()}

# Trova la combinazione più frequente o usa una combinazione di default se il dizionario è vuoto
if combination_percentages:
    most_frequent_combination = max(combination_percentages.items(), key=lambda x: x[1])
else:
    most_frequent_combination = (['No combinations found'], 0)

# Scrivi i risultati sul file di output CSV
with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=';')

    # Scrivi la combinazione più frequente o la combinazione di default
    writer.writerow([' - '.join(most_frequent_combination[0]), "{:.2f}%".format(most_frequent_combination[1])])

    # Aggiungi elementi alle combinazioni in modo incrementale
    for i in range(2, max_elements + 1):
        current_combination = most_frequent_combination[0][:i]
        next_element = max(set(header) - set(current_combination), key=lambda x: combination_counts[tuple(sorted(current_combination + (x,)))])
        current_combination += (next_element,)
        current_combination_percentage = combination_percentages.get(tuple(sorted(current_combination)), 0)
        writer.writerow([' - '.join(current_combination), "{:.2f}%".format(current_combination_percentage)])

        # Aggiorna la combinazione più frequente
        most_frequent_combination = (current_combination, current_combination_percentage)

    # Aggiungi un elemento alla combinazione corrente per altre tre volte
    for _ in range(3):
        current_combination = most_frequent_combination[0]
        next_element = max(set(header) - set(current_combination), key=lambda x: combination_counts[tuple(sorted(current_combination + (x,)))])
        current_combination += (next_element,)
        current_combination_percentage = combination_percentages.get(tuple(sorted(current_combination)), 0)
        writer.writerow([' - '.join(current_combination), "{:.2f}%".format(current_combination_percentage)])

        # Aggiorna la combinazione più frequente
        most_frequent_combination = (current_combination, current_combination_percentage)


