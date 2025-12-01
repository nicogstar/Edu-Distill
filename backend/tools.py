import tempfile
import os
from pathlib import Path
import PyPDF2


class Tools:
    """Utility class for handling PDF and audio operations."""

    @staticmethod
    def extract_text_from_pdf(file_obj):
        """
        Extract text from a PDF file object using PyPDF2.

        Args:
            file_obj: A file-like object (e.g., UploadedFile from Streamlit).

        Returns:
            str: Extracted text from all pages of the PDF.

        Raises:
            ValueError: If the PDF is invalid or cannot be read.
        """
        try:
            pdf_reader = PyPDF2.PdfReader(file_obj)
            text = ""

            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"

            if not text.strip():
                raise ValueError("No text could be extracted from the PDF.")

            return text

        except PyPDF2.PdfReadError as e:
            raise ValueError(f"Failed to read PDF file: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {str(e)}")

    @staticmethod
    def save_temp_audio(audio_bytes):
        """
        Save audio bytes to a temporary file for API transmission.

        Args:
            audio_bytes (bytes): Raw audio bytes.

        Returns:
            str: Path to the temporary audio file.

        Raises:
            ValueError: If audio cannot be saved.
        """
        try:
            # Create a temporary file with .wav extension
            temp_file = tempfile.NamedTemporaryFile(
                delete=False, suffix=".wav", dir=tempfile.gettempdir()
            )
            temp_file.write(audio_bytes)
            temp_file.close()

            return temp_file.name

        except Exception as e:
            raise ValueError(f"Error saving audio to temporary file: {str(e)}")
