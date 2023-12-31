const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getUserDetails,
  allUsers,
  updateUser,
  deleteUser,
} = require("../controllers/authControllers");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

//admin specific routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);

module.exports = router;
