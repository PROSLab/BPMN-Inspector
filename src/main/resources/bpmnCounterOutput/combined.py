import csv
from collections import defaultdict
from itertools import combinations

# Percorso del file CSV
input_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets.csv"
output_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets_output.csv"

# Dizionario per il conteggio delle coppie di elementi
pair_counts = defaultdict(int)

# Dizionario per il conteggio delle triplette di elementi
triple_counts = defaultdict(int)

# Dizionario per il conteggio delle quadruple di elementi
quadruple_counts = defaultdict(int)

# Dizionario per il conteggio delle quintuple di elementi
quintuple_counts = defaultdict(int)

# Numero massimo di elementi da considerare
max_elements = 5

# Leggi il file CSV e calcola i conteggi delle coppie, triplette, quadruple e quintuple di elementi
with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    header = next(reader)  # Salta l'header

    # Calcola gli indici delle colonne per gli elementi sulla riga corrente
    element_indices = [i for i, cell in enumerate(header) if cell not in ['']]

    # Calcola i conteggi delle coppie, triplette, quadruple e quintuple di elementi per ogni riga
    total_models = 0
    for row in reader:
        row_elements = [header[i] for i in element_indices if i < len(row) and row[i].isdigit() and int(row[i]) > 0]

        # Genera tutte le possibili coppie di elementi
        for r in range(2, min(max_elements + 1, len(row_elements) + 1)):
            combinations_r = combinations(row_elements, r)
            pairs = [combination for combination in combinations_r]

            # Incrementa il conteggio per ogni coppia di elementi
            for pair in pairs:
                pair_counts[pair] += 1

            # Genera tutte le possibili triplette, quadruple e quintuple di elementi
            for i in range(r - 1):
                combinations_i = combinations(pair, i + 1)
                combinations_remaining = combinations(row_elements, r - i - 1)
                for combination_i in combinations_i:
                    for combination_remaining in combinations_remaining:
                        triple = combination_i + combination_remaining
                        triple_counts[triple] += 1

        total_models += 1

# Calcola la percentuale di presenza per ogni coppia di elementi
pair_percentages = {pair: count / total_models * 100 for pair, count in pair_counts.items()}

# Trova la coppia più frequente
most_frequent_pair = max(pair_percentages.items(), key=lambda x: x[1])

# Calcola la percentuale di presenza per ogni tripla di elementi con la coppia più frequente
triple_percentages = {triple: count / pair_counts[most_frequent_pair[0]] * 100 for triple, count in triple_counts.items() if most_frequent_pair[0][0] in triple and most_frequent_pair[0][1] in triple}

# Trova la tripla più frequente
most_frequent_triple = max(triple_percentages.items(), key=lambda x: x[1])

# Calcola la percentuale di presenza per ogni quadrupla di elementi con la tripla più frequente
quadruple_percentages = {quad: count / triple_counts[most_frequent_triple[0]] * 100 for quad, count in quadruple_counts.items() if most_frequent_triple[0][0] in quad and most_frequent_triple[0][1] in quad and most_frequent_triple[0][2] in quad}

if quadruple_percentages:
    # Trova la quadrupla più frequente
    most_frequent_quadruple = max(quadruple_percentages.items(), key=lambda x: x[1])
else:
    most_frequent_quadruple = None

# Calcola la percentuale di presenza per ogni quintupla di elementi con la quadrupla più frequente
quintuple_percentages = {quint: count / quadruple_counts[most_frequent_quadruple[0]] * 100 for quint, count in quintuple_counts.items() if most_frequent_quadruple[0][0] in quint and most_frequent_quadruple[0][1] in quint and most_frequent_quadruple[0][2] in quint and most_frequent_quadruple[0][3] in quint}

if quintuple_percentages:
    # Trova la quintupla più frequente
    most_frequent_quintuple = max(quintuple_percentages.items(), key=lambda x: x[1])
else:
    most_frequent_quintuple = None

# Scrivi i risultati sul file di output CSV
with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=';')
    writer.writerow([most_frequent_pair[0][0] + " - " + most_frequent_pair[0][1], "{:.2f}%".format(most_frequent_pair[1])])
    writer.writerow([most_frequent_triple[0][0] + " - " + most_frequent_triple[0][1] + " - " + most_frequent_triple[0][2], "{:.2f}%".format(most_frequent_triple[1])])

    if most_frequent_quadruple:
        writer.writerow([most_frequent_quadruple[0][0] + " - " + most_frequent_quadruple[0][1] + " - " + most_frequent_quadruple[0][2] + " - " + most_frequent_quadruple[0][3], "{:.2f}%".format(most_frequent_quadruple[1])])

    if most_frequent_quintuple:
        writer.writerow([most_frequent_quintuple[0][0] + " - " + most_frequent_quintuple[0][1] + " - " + most_frequent_quintuple[0][2] + " - " + most_frequent_quintuple[0][3] + " - " + most_frequent_quintuple[0][4], "{:.2f}%".format(most_frequent_quintuple[1])])
