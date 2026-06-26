from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
import os

from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate

app = FastAPI(title="A3 RAG Inference Engine")

# --- Pydantic Models ---

class WeatherDataPayload(BaseModel):
    latitude: float
    longitude: float
    wind_speed: float
    wind_direction: str
    wave_height: float
    tide_status: str

class RagAnalysisResponse(BaseModel):
    risk_level: str
    matched_rules: List[str]
    navigational_advice: str

# --- RAG Setup ---

# 1. Setup Embeddings (Uses very little RAM, downloads locally)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 2. Setup Vector Store (ChromaDB)
# Persistent directory for the local database inside the project
persist_directory = "./chroma_db"

vector_store = Chroma(
    collection_name="captains_logs",
    embedding_function=embeddings,
    persist_directory=persist_directory
)

# Pre-populate database if it is empty
try:
    if vector_store._collection.count() == 0:
        print("Initializing ChromaDB with Captain's Logs...")
        initial_docs = [
            "If Wind > 7 m/s on Northeast monsoon + ebbing tide = Rogue waves at Pengjia Islet. High risk of capsizing.",
            "Wave heights exceeding 3 meters combined with strong crosswinds require reduced speeds and securing of all deck cargo.",
            "Calm conditions under 1.5m waves and wind < 4 m/s are optimal for coastal navigation.",
            "Sudden pressure drops accompanied by wind shifts from SW to NW indicate a squall line. Secure external hatches immediately.",
            "In shallow reefs like Dongsha, 2m waves can amplify rapidly during incoming tide. Keep 2 nautical miles distance."
        ]
        vector_store.add_texts(initial_docs)
        print(f"Added {len(initial_docs)} documents to vector store.")
except Exception as e:
    print(f"Warning: Could not initialize ChromaDB fully: {e}")

# 3. Setup LLM (Ollama)
# Note: Requires Ollama running locally with the phi3 model
llm = Ollama(model="phi3")

# 4. Setup Prompt
prompt_template = """
You are an expert Maritime AI Assistant. You assess risk based on current weather conditions and historical Captain's Logs.

Current Weather Conditions:
Latitude: {lat}, Longitude: {lon}
Wind: {wind_speed} m/s ({wind_direction})
Waves: {wave_height} m
Tide: {tide}

Relevant Captain's Logs:
{context}

Based ONLY on the relevant logs and weather conditions, provide a concise risk assessment.
Format your response exactly like this (nothing else):
Risk Level: [High, Medium, or Low]
Advice: [Your actionable advice]
"""
prompt = PromptTemplate(
    input_variables=["lat", "lon", "wind_speed", "wind_direction", "wave_height", "tide", "context"],
    template=prompt_template,
)

# --- API Endpoints ---

@app.post("/api/v1/rag/analyze", response_model=RagAnalysisResponse)
async def analyze_rag(payload: WeatherDataPayload):
    try:
        # 1. Create a semantic query string from the payload
        query = f"Wind {payload.wind_speed} m/s {payload.wind_direction}, waves {payload.wave_height}m, tide {payload.tide_status}"
        
        # 2. Retrieve relevant documents from Chroma via semantic search
        retriever = vector_store.as_retriever(search_kwargs={"k": 2})
        docs = retriever.invoke(query)
        context = "\n".join([doc.page_content for doc in docs])
        matched_rules = [doc.page_content for doc in docs]

        # 3. Generate response using LLM
        chain = prompt | llm
        llm_response = chain.invoke({
            "lat": payload.latitude,
            "lon": payload.longitude,
            "wind_speed": payload.wind_speed,
            "wind_direction": payload.wind_direction,
            "wave_height": payload.wave_height,
            "tide": payload.tide_status,
            "context": context
        })
        
        # 4. Parse LLM response
        risk_level = "Medium"
        advice = llm_response.strip()
        
        # Simple extraction for structured response
        lines = llm_response.split("\n")
        for line in lines:
            if line.startswith("Risk Level:"):
                risk_level = line.replace("Risk Level:", "").strip()
            elif line.startswith("Advice:"):
                advice = line.replace("Advice:", "").strip()

        # Fallback extraction if LLM didn't format perfectly
        if "High" in risk_level: risk_level = "High"
        elif "Low" in risk_level: risk_level = "Low"
        else: risk_level = "Medium"

        return RagAnalysisResponse(
            risk_level=risk_level,
            matched_rules=matched_rules,
            navigational_advice=advice
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error during RAG synthesis: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
