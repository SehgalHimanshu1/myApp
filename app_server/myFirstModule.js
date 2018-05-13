let val = 9;
logg = function (req, res, next){
  console.log("hey this just executed!");
  console.log(val);
};
exports.setVal = function(value){
  val = value;console.log(val);
}

exports.logg=logg;
exports[9] = 'nitht';
exports.hey = 'yu';