module.exports = function updateDataCompletedTask(change, context) {
  const document = change.after.data();
  const uid = context.params.userId;
  const { name, phone_num } = document;

  const dataCompleted = (name && phone_num) ? true : false;

  return change.after.ref
    .update({ data_completed: dataCompleted })
    .then(() => {
      console.log(`[Success] user data completed: ${uid}`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to update 'data_completed': ${err}`);
    });
};