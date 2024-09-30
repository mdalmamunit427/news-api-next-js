const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

// middleware
app.use(express.json());
app.use(cors())

const data = require('./data/db.json');

app.get('/', (req, res) => {
  res.send('Next News API Sever!');
});

// Get all news with search and category filters
app.get('/api/news', (req, res) => {
    const { search, category } = req.query; // Removed 'keywords'
  
    let filteredNews = data; // Start with all news data
  
    // Filtering by search term
    if (search) {
      const searchText = search.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        const titleMatch = newsItem.title.toLowerCase().includes(searchText);
        const descriptionMatch = newsItem.description.toLowerCase().includes(searchText);
        return titleMatch || descriptionMatch;
      });
    }
  
    // Filtering by category
    if (category) {
      const categoryText = category.toLowerCase();
      filteredNews = filteredNews.filter((newsItem) => {
        return newsItem.categories && newsItem.categories.map(cat => cat.toLowerCase()).includes(categoryText);
      });
    }
  
    // Respond with the filtered news
    res.send(filteredNews);
  });

// Get a single news item by its ID
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;

  // Find the news item with the matching ID
  const newsItem = data.find((item) => item._id === id);

  // If the news item is not found, send a 404 response
  if (!newsItem) {
    return res.status(404).send({ message: 'News item not found' });
  }

  // Send the found news item
  res.send(newsItem);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
