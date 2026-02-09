import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export const generateBookSummary = async (
  title: string,
  author: string,
  description: string = ''
): Promise<string> => {
  try {
    let promptText = `Provide a concise summary of the book "${title}" by ${author}.`;
    if (description) {
      promptText += ` Here's additional information about the book: ${description}`;
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: any = await response.json();
    
    // Extract text from the response format
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text || 'No summary generated.';
    }
    
    return 'No summary generated.';
  } catch (error) {
    console.error('Error generating book summary:', error);
    return 'Unable to generate summary at this time.';
  }
};

export const askAboutBooks = async (query: string): Promise<string> => {
  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `As a library assistant, please answer this question about books: ${query}`
            }
          ]
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: any = await response.json();
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text || 'No response generated.';
    }
    
    return 'No response generated.';
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Unable to process your request at this time.';
  }
};


// Add this new function to your file

export const getBookRecommendations = async (
  query: string,
  books: any[]
): Promise<any[]> => {
  try {
    // Create a simplified book list to keep prompt size manageable
    const bookList = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      subject: book.subject,
      researchArea: book.researchArea,
      description: book.description ? book.description.substring(0, 100) + '...' : ''
    }));

    const promptText = `
You are a library assistant. A user is searching for books with the query: "${query}"
Here is our catalog of books:
${JSON.stringify(bookList, null, 2)}

Return ONLY a JSON array of book IDs that match the search query. 
Consider relevance to subject, research area, title, author, and description.
Format your response as a valid JSON array of numbers like this: [1, 4, 7]
`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: any = await response.json();
    
    // Extract text from the response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON array from response (handling potential text around it)
      const jsonMatch = responseText.match(/\[.*?\]/s);
      if (jsonMatch) {
        try {
          const bookIds = JSON.parse(jsonMatch[0]);
          return books.filter(book => bookIds.includes(book.id));
        } catch (e) {
          console.error('Error parsing recommended book IDs:', e);
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    return [];
  }
};