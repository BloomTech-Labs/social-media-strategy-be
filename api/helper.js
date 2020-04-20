module.exports = [joivalidation, joivalidationError, lengthcheck, routerModels];

function joivalidation(reqbody, schema) {
  return Object.keys(reqbody).length === 0 || schema.validate(reqbody).error;
}
function joivalidationError(reqbody, schema) {
  return schema.validate(reqbody).error;
}
async function lengthcheck(model) {
  let lengthcheck = await model;
  return lengthcheck.length;
}

function routerModels(modal, req, res) {
  modal
    .then((data) => {
      data ? res.status(200).json(data) : res.status(404).json('Nothing found');
    })
    .catch((error) => {
      console.log(error.message, 'ERROR');
      res.status(500).json({
        message: error.message,
        error: error.stack,
        name: error.name,
        code: error.code,
      });
    });
}
