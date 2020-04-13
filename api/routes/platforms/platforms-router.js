const express = require("express");
const Platforms = require("./platforms-model.js");
const Joi = require("@hapi/joi");
const router = express.Router();
const { joivalidation, joivalidationError } = require("../../helper");

const schema = Joi.object({
  user_id: Joi.number(),
  platform: Joi.string().required(),
});

async function lengthcheck(model) {
  let lengthcheck = await model;
  return lengthcheck.length;
}

function platformModels(modal, req, res) {
  modal
    .then((platforms) => {
      console.log(platforms);
      platforms
        ? res.status(200).json(platforms)
        : res.status(404).json("Nothing found");
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code,
      });
    });
}

router.get("/", (req, res) => {
  platformModels(Platforms.find(), req, res);
  // Platforms.find()
  //   .then((platforms) => {
  //     res.status(200).json({ "All platforms": platforms });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message: "Error retrieving platforms",
  //       Error: err,
  //     });
  //   });
});

router.get("/:id", async (req, res) => {
  if ((await lengthcheck(Platforms.find({ id: req.params.id }))) === 0) {
    return res.status(404).json("not found");
  } else {
    platformModels(Platforms.find({ id: req.params.id }), req, res);
  }
  // let lengthcheck = await Platforms.find({ id: req.params.id });

  // Platforms.find({ id })
  //   .then((platforms) => {
  //     res.status(200).json({ "Platform with specified ID": platforms });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: "Platform with specified ID not found",
  //       Error: err,
  //     });
  //   });
});

router.get("/:id/user", (req, res) => {
  const { id } = req.params;

  platformModels(Platforms.find({ user_id: id }), req, res);

  // Platforms.find({ user_id: id })
  //   .then((platforms) => {
  //     res.status(200).json({ "Platform by specified user": platforms });
  //   })
  //   .catch((err) => {
  //     res.status(404).json({
  //       message: "Platform with specified ID not found",
  //       Error: err,
  //     });
  //   });
});

router.post("/:id/user", (req, res) => {
  const { id } = req.params;
  const platformbody = { ...req.body, user_id: id };

  if (joivalidation(platformbody, schema)) {
    res.status(500).json(joivalidationError(platformbody, schema));
  } else {
    platformModels(Platforms.add(platformbody), req, res);

    // *** These are the same ------

    // Platforms.add(platformbody) //May need to change depending on payload
    //   .then((value) => {
    //     res.status(200).json({ "Added platform: ": value });
    //   })
    //   .catch((err) => {
    //     console.log("HELLO platformS");
    //     res.status(500).json({
    //       message: "Platform cannot be added",
    //       Error: err.message,
    //       stack: err.stack,
    //       code: err.code,
    //     });
    //   });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const update = req.body;

  platformModels(Platforms.update(update, id), req, res);

  // Platforms.update(update, id) //May need to change depending on payload
  //   .then((value) => {
  //     res.status(201).json({ "Updated platform: ": value });
  //   })
  //   .catch((err) => {
  //     // console.log(err.message)
  //     res
  //       .status(500)
  //       .json({ message: "platform cannot be updated", Error: err.message });
  //   });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  platformModels(Platforms.remove(id), req, res);

  // Platforms.remove(id)
  //   .then((response) => {
  //     res.status(200).json({ message: "platform deleted", response });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .json({ message: "platform cannot be removed", Error: err.message });
  //   });
});

module.exports = router;
