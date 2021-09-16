const USER_MANAGEMENT = require("./controllers/userManagement");

module.exports = (app) => {

    app.post("/createuser", USER_MANAGEMENT.SignUp);
}