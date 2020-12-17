const { db } = require('../config');

module.exports = async function deleteCollection(path) {
  const docRefs = await db.collection(path).listDocuments();
  const deleteJobs = docRefs.map(ref => ref.delete());
  await Promise.all(deleteJobs);
}