import express from "express";
const router = express.Router();

router.get("/ping", (req, res) => {
    res.status(200).send("Backend is alive!");
});

export default router;
