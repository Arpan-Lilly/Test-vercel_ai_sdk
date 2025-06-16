import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

// StackOverflow API Configuration
const stackOverflowApiUrl = 'https://elilillyco.stackenterprise.co/api/v3/articles';
const bearerToken = 'rl_13AeCTrqhHSh6d6UkDu3AKNnB';

/**
 * Fetch articles from StackOverflow API with pagination.
 * @param {number} page - The page number to fetch.
 */
async function fetchStackOverflowArticles(page = 1) {
  try {
    const response = await fetch(`${stackOverflowApiUrl}?page=${page}&pageSize=30`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching articles: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the full response (including items and pagination info)
  } catch (error) {
    console.error('Error fetching StackOverflow articles:', error);
    throw error;
  }
}

/**
 * Fetch all articles by paginating through results.
 */
async function fetchAllStackOverflowArticles() {
  let allArticles = [];
  let page = 1;
  let totalPages = 1;

  console.log('Fetching all StackOverflow articles...');

  do {
    const data = await fetchStackOverflowArticles(page);

    if (data && data.items) {
      allArticles = allArticles.concat(data.items); // Append articles to the list
      totalPages = data.totalPages; // Update total pages from the response
      page++;
    } else {
      console.log('No more articles to fetch.');
      break;
    }
  } while (page <= totalPages);

  return allArticles;
}

// Routes

// Route to fetch articles with pagination
app.get('/articles', async (req, res) => {
  const { page = 1 } = req.query; // Get the page number from query parameters
  try {
    const data = await fetchStackOverflowArticles(page);
    res.json(data); // Return the paginated response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Route to fetch all articles
app.get('/articles/all', async (req, res) => {
  try {
    const allArticles = await fetchAllStackOverflowArticles();
    res.json(allArticles); // Return all articles
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all articles' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`MCP server is running on http://localhost:${PORT}`);
});