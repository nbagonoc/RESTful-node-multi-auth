const express = require("express");
const router = express.Router();
const passport = require("passport");
const isAdmin = require("../../guards/isAdmin");
const userController = require("../../controllers/user.controller");
// const isModerator = require("../../guards/isModerator");

router.get("/", passport.authenticate("jwt", {session: false}), isAdmin, userController.getUsers); // GET | api/users | view users list
router.get("/profile", passport.authenticate("jwt", {session: false}), userController.getProfile); // GET | api/users/profile | view current user profile
router.get("/view/:id", passport.authenticate("jwt", {session: false}), isAdmin, userController.getUser); // GET | api/users/view/:id | get user
router.put("/update/:id", passport.authenticate("jwt", {session: false}), isAdmin, userController.updateUser); // PUT | api/users/update | update user
router.delete("/delete/:id", passport.authenticate("jwt", {session: false}), isAdmin, userController.deleteUser); // DELETE | api/users/delete/:id | delete user

module.exports = router;
