from fastapi import FastAPI, UploadFile, File, HTTPException
import pytesseract
from PIL import Image
import io
from llm_service import EvaluationRequest, evaluate_essay_logic

app = FastAPI(title="Pen2Grade AI Service")

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}

@app.post("/api/ocr")
async def extract_text_from_image(file: UploadFile = File(...)):
    """
    Extracts text from an uploaded image file using Tesseract OCR.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image file into memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Perform OCR
        extracted_text = pytesseract.image_to_string(image)
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": extracted_text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Processing Error: {str(e)}")

@app.post("/api/evaluate")
def evaluate_essay(request: EvaluationRequest):
    """
    Evaluates the essay text against provided rubric criteria.
    Uses OpenAI if API key is set, otherwise returns a mock score.
    """
    try:
        result = evaluate_essay_logic(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
