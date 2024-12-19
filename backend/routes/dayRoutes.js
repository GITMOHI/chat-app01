const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { postDays, getDays } = require("../controllers/dayControllers");
const { addReaction, getReactionCounts } = require("../controllers/reactionControllers.");

const router = express.Router();

router.route("/").post(protect, postDays);
router.route("/").get(protect, getDays);
router.route('/reactions').post(protect, addReaction);
router.route('/getRectionCounts').post(protect, getReactionCounts);

module.exports = router;