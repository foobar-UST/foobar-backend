const { db } = require('../config');

const deleteCollection = async path => {
  const docRefs = await db.collection(path).listDocuments();
  const deleteJobs = docRefs.map(ref => ref.delete());
  await Promise.all(deleteJobs);
};

module.exports = deleteCollection;