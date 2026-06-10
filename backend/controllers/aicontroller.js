const {GoogleGenAI} = require('google-genai');
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});
//generate a book outline based on a prompt
//POST /api/ai/generate-outline
//access: private
const generateOutline = async (req, res) => {
    try {
        const { topic,style,numChapters,description } = req.body;
        if(!topic){
            return res.status(400).json({ message: "Topic is required" });

        }
        const prompt='';

            const response = await ai.generateContent({
                model: "gemini-2.5-flash-lite",
                content: prompt,
            });
            const text=response.text;
            //find and extract the js array from the responsive text
          const startIndex=text.indexOf("["); 
          const endIndex=text.lastIndexOf("]");
          if(startIndex===-1 || endIndex===-1 ){
          console.error("No array found in response:", text);
    
          return res
            .status(500)
            .json({ message: "Error generating outline" });
            }
            const jsonstring=text.substring(startIndex,endIndex+1);
            //validate if response is valid json
            try {
                const outline=JSON.parse(jsonstring);
                res.startIndex(200).json({ outline });
            } catch (error) {
                console.error("Invalid JSON in response:", jsonstring);
                res.status(500).json({
                     message: "Error generating outline" });
            
            }
    } catch (error) {
        console.error("Error generating outline:", error);
        res
        .status(500).
        json({ message: "Server error" });
    }

};
//generate content for a chapter based on a prompt
//POST /api/ai/chapter-content
//access: private
const generateChapterContent = async (req, res) => {
    try {
    } catch (error) {
        console.error("Error generating chapter content:", error);
        res
        .status(500).
        json({ message: "Server error" });
    }
};
module.exports = {
    generateOutline,
    generateChapterContent,
};