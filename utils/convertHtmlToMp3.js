const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function convertHtmlToMp3(htmlString, word) {
  // Define a regex pattern to match MP3 URLs
  const mp3Regex = /https?:\/\/[^'"]+\.mp3/g;

  // Use the regex pattern to extract MP3 URLs from the HTML string
  const mp3Matches = htmlString.match(mp3Regex);

  if (mp3Matches && mp3Matches.length > 0) {
    // Filter the matches to include only URLs containing the specified word
    const filteredMatches = mp3Matches.filter(url => url.includes(word));

    // Pick the first filtered MP3 URL or the first unfiltered one if the filtered array is empty
    const mp3Url = filteredMatches.length > 0 ? filteredMatches[0] : mp3Matches[0];

    try {
      // Download the MP3 file
      const response = await axios.get(mp3Url, { responseType: 'arraybuffer' });

      // Save the MP3 file to the 'downloads' folder with the word as filename
      const filePath = path.join(__dirname, '..', 'downloads', `${word}.mp3`);
      fs.writeFileSync(filePath, response.data);

      console.log(`Successfully downloaded: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error(`Error downloading MP3 from URL '${mp3Url}':`, error);
      throw error;
    }
  } else {
    console.error(`No MP3 URL found for the word '${word}' in the HTML.`);
    return null; // Return null or an appropriate value to indicate the failure
  }
}

module.exports = { convertHtmlToMp3 };
