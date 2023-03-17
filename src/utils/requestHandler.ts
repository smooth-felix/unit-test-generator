const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

function cleanUnitTestCode(code: string) {
  // Remove unwanted <code> tags
  code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  
  // Replace HTML entities with their original form
  code = code.replace(/&quot;/g, '"').replace(/&apos;/g, "'");

  return formatString(code);
}

function formatString(str: string) {
  if (str.startsWith('.')) {
    str = str.substring(1);
  }
  str = str.trim().slice(0, -7);
  return str;
}
const fetchData = async (content: string) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: content,
      temperature: 0,
      max_tokens: 2048,
    });
    if (response) {
      return cleanUnitTestCode(response.data?.choices[0].text);
    }
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;