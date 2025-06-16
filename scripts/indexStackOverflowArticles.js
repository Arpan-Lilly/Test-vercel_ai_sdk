// import { createClient } from '@supabase/supabase-js';

// // Supabase configuration
// const supabaseUrl = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
// const supabaseKey = 'your-supabase-key'; // Replace with your Supabase Key
// const supabase = createClient(supabaseUrl, supabaseKey);

// // StackOverflow API configuration
// const stackOverflowApiUrl = 'https://elilillyco.stackenterprise.co/api/v3/articles';
// const bearerToken = '';

// /**
//  * Fetch articles from StackOverflow API.
//  */
// async function fetchStackOverflowArticles() {
//   try {
//     const response = await fetch(stackOverflowApiUrl, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error fetching articles: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data.items; // Return the articles array
//   } catch (error) {
//     console.error('Error fetching StackOverflow articles:', error);
//     return [];
//   }
// }

// /**
//  * Store articles in Supabase.
//  * @param {Array} articles - Array of articles to store.
//  */
// async function storeArticlesInSupabase(articles) {
//   try {
//     const { data, error } = await supabase
//       .from('stackoverflow_articles') // Replace with your table name
//       .insert(
//         articles.map(article => ({
//           id: article.id,
//           title: article.title,
//           body: article.body,
//           tags: JSON.stringify(article.tags.map(tag => tag.name)), // Store tags as JSON
//           owner: article.owner.name,
//           creation_date: article.creationDate,
//           last_activity_date: article.lastActivityDate,
//           web_url: article.webUrl,
//         }))
//       );

//     if (error) {
//       throw error;
//     }

//     console.log('Articles stored successfully:', data);
//   } catch (error) {
//     console.error('Error storing articles in Supabase:', error);
//   }
// }

// /**
//  * Fetch and store StackOverflow articles.
//  */
// async function indexStackOverflowArticles() {
//   console.log('Fetching StackOverflow articles...');
//   const articles = await fetchStackOverflowArticles();

//   if (articles.length > 0) {
//     console.log(`Fetched ${articles.length} articles. Storing in Supabase...`);
//     await storeArticlesInSupabase(articles);
//     console.log('Indexing completed.');
//   } else {
//     console.log('No articles to index.');
//   }
// }

// // Execute the function
// indexStackOverflowArticles();

// import { createClient } from '@supabase/supabase-js';

// // Supabase configuration
// const supabaseUrl = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
// const supabaseKey = 'your-supabase-key'; // Replace with your Supabase Key
// // const supabase = createClient(supabaseUrl, supabaseKey);

// StackOverflow API configuration
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
    return null;
  }
}

/**
 * Fetch all articles by paginating through results.
 */
async function fetchAllStackOverflowArticles() {
  let allArticles = [];
  let page = 1;
  let totalPages = 1;
  let totalCount = 0;

  console.log('Fetching all StackOverflow articles...');

  do {
    const data = await fetchStackOverflowArticles(page);

    if (data && data.items) {
      allArticles = allArticles.concat(data.items); // Append articles to the list
      totalPages = data.totalPages; // Update total pages from the response
      totalCount = data.totalCount; // Update total count from the response
      page++;
    } else {
      console.log('No more articles to fetch.');
      break;
    }
  } while (page <= totalPages);

  console.log(`Fetched ${allArticles.length} articles out of ${totalCount}.`);
  console.log('First 2 articles:', allArticles.slice(0, 2)); // Display the first 2 articles
}

// Execute the function
fetchAllStackOverflowArticles();
