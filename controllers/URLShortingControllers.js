const axios = require("axios");
const { db } = require("../firebase");

exports.shortUrl = async (req, res) => {
  try {
    const LongUrl = `https://api.shrtco.de/v2/shorten?url=${req.query.url}/u/0/project/thenodeproject-1dc6c/firestore/data/~2Fimages~2FT4aSvZ7w4ne5yCHvYqDx/very/long/link.html`;

    // Make an Axios request to the shortening service
    const axiosResponse = await axios.post(LongUrl);

    // Save the shortened URL in the database
    const new_short_link = axiosResponse.data.result.full_short_link;
    await db.collection("Urls").add({ new_short_link });

    res.send(new_short_link);
  } catch (error) {
    res.send(error);
  }
};
