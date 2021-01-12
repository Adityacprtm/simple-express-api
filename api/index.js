var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  if (req.user) {
    res.redirect(`/api/${req.user.username}`);
  } else {
    next(new Error("Un-Authorized! Need to login ⚠"));
  }
});

router.get("/:id", (req, res) => {
  if (req.params.id == req.user.username) {
    res.json({
      message: `🎉 You passed the auth, Well Played ${req.user.username}`,
      user: req.user,
    });
  } else {
    res.redirect(`/api/${req.user.username}`);
  }
});

module.exports = router;
