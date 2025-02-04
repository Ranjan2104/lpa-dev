const cron = require("node-cron");
const {
  updateBattleResult,
  updateBttleResultNotUpdatedByUser,
  updateBattleIFNoAcceptor,
} = require("./cronHelper");

// Example 1: Update battle result (Runs every minute)
//cron.schedule("* * * * *", updateBattleResult);
// Example 2: Update battle result not updated by user (Runs every minute)
cron.schedule("* * * * *", updateBttleResultNotUpdatedByUser);
// Example 3:Delete battle if no acceptor (Runs every minute)
cron.schedule("* * * * *", updateBattleIFNoAcceptor);
