module.exports = {

  // Utility for handling different success / error json output
  success : function(res, obj){
    res.setHeader('Content-Type', 'application/json');
    res
      .status(200)
      .send(obj);
  },

  error : function(res, code, msg){
    res.setHeader('Content-Type', 'application/json');
    res
      .status(code)
      .send({
        error : msg
      });
  }

}
