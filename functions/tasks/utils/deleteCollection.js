const { db } = require('../../config');

module.exports = async function deleteCollection(path) {
  const refs = await db.collection(path).listDocuments();
  let deleteJobs = refs.map(ref => ref.delete());

  return await Promise.all(deleteJobs);
}