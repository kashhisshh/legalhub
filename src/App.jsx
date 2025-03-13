import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';
import Markdown from 'react-markdown';
import jsPDF from 'jspdf';

const Form = ({ country, situation, onCountryChange, onSituationChange, onGenerateResponse, isLoading }) => (
  <div className="container">
    <label>Select Country:</label>
    <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
    <option value="" id='selectdefault'>Select Country</option>
    <option value="Africa">Africa</option>
    <option value="Brazil">Brazil</option>
    <option value="Bangladesh">Bangladesh</option>
    <option value="China">China</option>
    <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
    <option value="Europe">Europe</option>
    <option value="France">France</option>
    <option value="Germany">Germany</option>
    <option value="India">India</option>
    <option value="Japan">Japan</option>
    <option value="Korea, North">Korea, North</option>
    <option value="Liberia">Liberia</option>
    <option value="Mexico">Mexico</option>
    <option value="Nigeria">Nigeria</option>
    <option value="Oman">Oman</option>
    <option value="Pakistan">Pakistan</option>
    <option value="Qatar">Qatar</option>
    <option value="Russia">Russia</option>
    <option value="Saudi Arabia">Saudi Arabia</option>
    <option value="Turkey">Turkey</option>
    <option value="United Kingdom">United Kingdom</option>
    <option value="United States of America">United States of America</option>
    <option value="Vietnam">Vietnam</option>
    <option value="Yemen">Yemen</option>
    <option value="Zambia">Zambia</option>
    
    
    {/* Add more countries as needed */}
    </select>
    <br />
    <label>Describe the Legal Situation:</label>
    <textarea
      rows="4"
      cols="50"
      value={situation}
      onChange={(e) => onSituationChange(e.target.value)}
    ></textarea>
    <br />
    <button onClick={onGenerateResponse} disabled={isLoading}>
      Generate Response
    </button>
    {isLoading && <p className="loading">Loading...</p>}
  </div>
);

const Response = ({ response, isResponseAvailable }) => (
  <div className="container">
    <h2>LegalHub says:</h2>
    {/* Use Markdown to render the response */}
    <Markdown>{response}</Markdown>
    {isResponseAvailable && (
      <button className="download-button" onClick={() => {
        // Generate PDF and download
        const pdf = new jsPDF();
        
        // Split text into lines to avoid text running off the page
        const splitText = pdf.splitTextToSize(response, 180);
        pdf.text(splitText, 10, 10);
        pdf.save('Legalhub.pdf');
      }}>
        Download as PDF
      </button>
    )}
  </div>
);

const MadeBy = () => (
  <div className='made-by'><span role="img" aria-label="symbol">❤️</span>Made with love</div>
);

const App = () => {
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Generative AI with the correct API key
  const API_KEY = 'AIzaSyDr5wgahrt2KMidFZ4F_1gUvEZIS0XRQm8';
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);
      setResponse(""); // Clear previous response
      console.log("Generating response...");
  
      if (!country || !situation) {
        console.error("Country and situation must be provided");
        setResponse("Please select a country and describe the situation.");
        setIsLoading(false);
        return;
      }
  
      console.log("Using country:", country);
      console.log("Situation entered:", situation);
  
      // Use the correct model name for the API version
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `You are a quick guidance for any law violation or government rule break for ${country} country, the information is just for education and awareness purpose and accessed by citizens. Provide (1) law mentioned in the ${country} government law/rule book, (2) Charges/fine/actions against the guilty according to the law, (3) Personal advice on what to do if found guilty and how to proceed further. The scenario is ${situation}.`;
  
      console.log("Prompt sent to AI:", prompt);
  
      const result = await model.generateContent(prompt);
      console.log("Raw API Response:", result);
  
      const generatedResponse = await result.response.text();
      console.log("Generated Response:", generatedResponse);
  
      setResponse(generatedResponse);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while generating the response: " + error.message);
    } finally {
      setIsLoading(false);
      console.log("Finished processing.");
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>Legal<span style={{ color: 'blue' }}>Hub</span></h1>
      </div>
      <Form
        country={country}
        situation={situation}
        onCountryChange={setCountry}
        onSituationChange={setSituation}
        onGenerateResponse={handleGenerateResponse}
        isLoading={isLoading}
      />
      {response && <Response response={response} isResponseAvailable={!isLoading} />}
      <MadeBy />
    </div>
  );
};

export default App;
