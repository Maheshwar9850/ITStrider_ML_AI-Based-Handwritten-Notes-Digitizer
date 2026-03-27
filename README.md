AI-Based Handwritten Notes Digitizer

 Problem Statement

Students and professionals often rely on handwritten notes, which are:

* Difficult to search and organize
* Prone to loss or damage
* Not easily shareable or editable

There is a need for a system that can convert handwritten content into structured, digital, and searchable text.


 Solution Overview

The AI-Based Handwritten Notes Digitizer** is a web application that:

* Accepts handwritten notes (images or PDFs)
* Uses **OCR (Optical Character Recognition)** to extract text
* Enhances the extracted text using **AI (summarization + formatting)**
* Optionally translates content into different languages
* Stores notes in a database for easy access and search

 Workflow

1. User uploads handwritten notes
2. Backend processes the file
3. OCR extracts text from the image
4. AI refines and structures the text
5. Final output is displayed and stored
6. User can view, edit, and search notes

 Tech Stack Used

 Frontend

* React.js
* Tailwind CSS
* Axios
* ShadCN UI (optional)

 Backend

* Node.js
* Express.js
* Multer (File Upload)

AI & OCR

* Google Cloud Vision API / Tesseract OCR
* OpenAI API / Google Gemini API
* Google Translate API

 Cloud & Database

* Cloudinary / Firebase Storage
* Firebase Firestore / MongoDB

 Authentication (Optional)

 Firebase Authentication

 Setup Instructions

 Clone the Repository

bash
git clone https://github.com/Maheshwar9850/ITStrider_ML_AI-Based-Handwritten-Notes-Digitizer.git
cd ITStrider_ML_AI-Based-Handwritten-Notes-Digitizer


 Frontend Setup

bash
cd frontend
npm install
npm run dev

 Backend Setup
bash
cd backend
npm install
npm start


 Team Members

* Maheshwar Gundawar
* Chetan Kharade
* Prajwal Rakhade

