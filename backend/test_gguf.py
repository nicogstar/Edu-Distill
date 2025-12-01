import json
import os
from llama_cpp import Llama

# === CONFIGURAZIONE ===
# Percorso del file che hai appena scaricato
MODEL_PATH = "models/qwen_evaluator_q4_k_m.gguf"

if not os.path.exists(MODEL_PATH):
    print(f"❌ ERRORE: Non trovo il file in {MODEL_PATH}")
    print("Assicurati di averlo scaricato e messo nella cartella giusta!")
    exit()

print("🚀 Caricamento modello GGUF (Low RAM)...")

# Caricamento Modello
# n_gpu_layers=-1 -> Sposta tutto sulla GPU (se hai i driver installati)
# n_ctx=2048      -> La memoria a breve termine (come nel training)
llm = Llama(
    model_path=MODEL_PATH,
    n_gpu_layers=-1, 
    n_ctx=2048,
    verbose=True # Mettiamo True così vediamo i dettagli tecnici nel terminale
)

print("\n✅ Modello caricato! Inizio il test di intelligenza...")

# === DATI DI TEST (Scenario: Overfitting) ===
# Domanda: Come prevenire l'overfitting?
# Risposta Studente (Sbagliata): "Allenare per più epoche".
# Il modello DEVE capire che è sbagliato.

system_prompt = """You are "Edu-Distill Student", a specialized model for grading.
Return ONLY a valid JSON object.
Structure: "score_30", "key_coverage", "missing_concepts", "hallucinations", "bias_check", "feedback"."""

user_message = """Context: Overfitting happens when a model learns noise. Solutions include regularization and early stopping.
Question: How do you fix overfitting?
Student Answer: You should train for more epochs to make sure it learns everything perfectly."""

# === INFERENZA ===
print("🤔 Il Giudice sta riflettendo...")

response = llm.create_chat_completion(
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ],
    temperature=0.1, # Preciso
    response_format={"type": "json_object"} # Forza il JSON (Funzione di Llama.cpp)
)

# === RISULTATO ===
raw_content = response['choices'][0]['message']['content']

print("\n" + "="*40)
print("📝 RISULTATO GREZZO DEL MODELLO:")
print(raw_content)
print("="*40 + "\n")

# Verifica JSON
try:
    parsed = json.loads(raw_content)
    print("✅ JSON Valido! Ecco il voto:")
    print(f"🎯 VOTO: {parsed.get('score_30')}/30")
    print(f"👀 ALLUCINAZIONI RILEVATE: {parsed.get('hallucinations')}")
    print(f"💡 FEEDBACK: {parsed.get('feedback')}")
except Exception as e:
    print(f"❌ Errore parsing JSON: {e}")