const { sign, verify } = require("jsonwebtoken");

const createTokens = (id) => {
  const accessToken = sign(
    { ID: id },
    "caleb1902"
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  let accessToken = req.headers["authorization"];
  accessToken = accessToken.slice(7,accessToken.length);

  if(accessToken){
    verify(accessToken,'caleb1902',(err,decoded)=>{
        if(err){
            return res.json({success:'false', msg:'Invalid Token'})
        }else{
            req.decoded=decoded;
            next();
        }
    })
  }else{
    return res.json({success:'false', msg:'Token not provided'})
  }
};

function pagnited(model) {
    return (req, res, next)=>{
      const page = parseInt(req.query.page) 
      const limit = parseInt(req.query.limit) 
    const startIndex = (page -1) * limit
    const endIndex = page * limit
    const pagnited = {}
    pagnited.pagnited = model.slice(startIndex, endIndex)
    if(endIndex < model.length ){
    pagnited.next = {
        page: page + 1,
        limit : limit,
    }
    }
    if(startIndex > 0){
    pagnited.previous = {
        page: page - 1,
        limit : limit,
    }
    }   
    res.pagnitedResult = pagnited
    next()
    }
}

module.exports = { createTokens, validateToken, pagnited };