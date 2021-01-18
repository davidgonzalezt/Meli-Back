const express = require("express");
const router = express.Router();
const controller = require('./controller');

// api/items
router.get("/",
    controller.getProductsByQuery
);

router.get("/:id", 
    controller.getProductById
);

module.exports = router;
