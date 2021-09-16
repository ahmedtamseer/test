const EXPRESS = require("express"),
APP = EXPRESS();

require("./routes")(APP);

APP.listen(3000)
