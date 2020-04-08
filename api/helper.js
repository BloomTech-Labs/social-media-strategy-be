module.exports = {joivalidation,joivalidationError}


function joivalidation(reqbody,schema){
    return Object.keys(reqbody).length === 0 || schema.validate(reqbody).error
  }
  function joivalidationError(reqbody,schema){
    return schema.validate(reqbody).error
  
  }