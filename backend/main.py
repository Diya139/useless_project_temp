from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Sadhya Item Placement Auditor is running!"
    }