const express = require('express');
const router = express.Router();
const axios = require('axios');
const { convertHtmlToMp3 } = require('../utils/convertHtmlToMp3');

const DICTIONARY_BASE_URL = process.env.DICTIONARY_URL_BASE;

router.get('/fetch', async (req, res) => {
  const words = req.query.words ? req.query.words.split(',') : [];

  const downloadPromises = words.map(async (word) => {
    const url = `${DICTIONARY_BASE_URL}/${word.trim()}`;

    try {
      const response = await axios.get(url);
      const htmlString = response.data;

      const filePath = convertHtmlToMp3(htmlString, word);

      return filePath;
    } catch (error) {
      console.error(`Error fetching the HTML for the word '${word}':`, error.message);
      return null;
    }
  });

  try {
    const files = await Promise.all(downloadPromises);
    const validFiles = files.filter(file => file !== null);

    res.json({ files: validFiles });
  } catch (error) {
    console.error('Error downloading MP3s:', error.message);
    res.status(500).send('Error downloading MP3s');
  }
});

module.exports = router;
