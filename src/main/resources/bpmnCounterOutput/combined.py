import csv
from collections import defaultdict

# Percorso del file CSV
input_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets.csv"
output_file = "src/main/resources/bpmnCounterOutput/bpmn_combinedSets.csv"

# Dizionario per il conteggio delle coppie di elementi
pair_counts = defaultdict(int)

# Leggi il file CSV e calcola i conteggi delle coppie di elementi
with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    header = next(reader)  # Salta l'header

    # Calcola gli indici delle colonne per gli elementi sulla riga corrente
    element_indices = [i for i, cell in enumerate(header) if cell not in ['']]

    # Calcola i conteggi delle coppie di elementi per ogni riga
    total_models = 0
    for row in reader:
        row_elements = [header[i] for i in element_indices if i < len(row) and row[i].isdigit() and int(row[i]) > 0]

        # Genera tutte le possibili coppie di elementi
        pairs = [(row_elements[i], row_elements[j]) for i in range(len(row_elements)) for j in range(i+1, len(row_elements))]

        # Incrementa il conteggio per ogni coppia di elementi
        for pair in pairs:
            pair_counts[pair] += 1

        total_models += 1

# Calcola la percentuale di presenza per ogni coppia di elementi
pair_percentages = {pair: count / total_models * 100 for pair, count in pair_counts.items()}

# Trova le 5 coppie più frequenti
top_pairs = sorted(pair_percentages.items(), key=lambda x: x[1], reverse=True)[:5]

# Aggiungi le 5 coppie più frequenti e le relative percentuali al file
with open(output_file, 'a', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=';')
    writer.writerow([])  # Aggiungi una riga vuota
    writer.writerow(["Top 5 Pairs", "Percentage"])

    for pair, percentage in top_pairs:
        writer.writerow([pair[0] + " - " + pair[1], "{:.2f}%".format(percentage)])
