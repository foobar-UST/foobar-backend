const { db } = require('../../config');

const searchCollection = async (searchQuery, collection, field, limit = 10) => {
  // Break query into words
  const queryWords = searchQuery.trim().split(' ');

  const results = [];

  // Search for items using individual words
  const searchPromises = queryWords.map(word => {
    return db.collection(collection)
      .where(field, '>=', word)
      .where(field, '<=', word + '\uf8ff')
      .limit(limit)
      .get();
  });

  const querySnapshots = await Promise.all(searchPromises);

  // Remove duplicated items
  querySnapshots.forEach(snapshot => {
    snapshot.forEach(doc => {
      results.push(doc.data());
    });
  });

  return [...new Set(results)];
};

module.exports = searchCollection;