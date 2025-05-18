// File: pages/api/chatbot.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, history } = req.body;
      
      // Use native fetch instead of axios
      // Gemini API URL - make sure this is the correct endpoint
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      
      // Get API key from environment variables
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error('GEMINI_API_KEY is not defined in environment variables');
        return res.status(500).json({ error: 'API key not configured' });
      }

      // Prepare conversation context from history
      const messages = [];
      
      // Add history if available
      if (history && history.length > 0) {
        for (const entry of history) {
          const role = entry.role === 'user' ? 'user' : 'model';
          messages.push({
            role: role,
            parts: [{ text: entry.text }]
          });
        }
      }
      
      // For the first message in a conversation, prepend context about being Resona
      if (!history || history.length <= 1) {
        // Insert a system message about identity by adding it as the first message
        messages.unshift({
          role: 'model',
          parts: [{ text: "I am Resona, an AI assistant here to help you. I'll do my best to provide helpful and accurate information." }]
        });
      }
      
      // If there's history but the last message isn't the current one, add it
      if (history && history.length > 0 && 
          (history[history.length - 1].role !== 'user' || 
          history[history.length - 1].text !== message)) {
        messages.push({
          role: 'user',
          parts: [{ text: message }]
        });
      } else if (!history || history.length === 0) {
        // Add current message if no history
        messages.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      // Prepare the request payload - removed systemInstruction which was causing the error
      const payload = {
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      // Make the API request
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API Error:', response.status, errorData);
        return res.status(response.status).json({ 
          error: 'Error from Gemini API', 
          details: errorData 
        });
      }

      const data = await response.json();
      
      // Extract the response text from Gemini API
      let responseText = '';
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts) {
        responseText = data.candidates[0].content.parts[0].text || '';
      } else {
        responseText = 'Sorry, I couldn\'t generate a response.';
      }

      // Ensure Resona introduces itself if the response doesn't include the name
      if ((!history || history.length <= 1) && 
          !responseText.toLowerCase().includes('resona')) {
        responseText = "I'm Resona. " + responseText;
      }

      // Return the response to the frontend
      return res.status(200).json({ response: responseText });
    } catch (error) {
      console.error('Error in chatbot API:', error);
      return res.status(500).json({ 
        error: 'Failed to communicate with Gemini API',
        message: error.message
      });
    }
  } else {
    // Handle non-POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}