const {productSchema}= require("./schema.js")
const ExpressError = require("./utils/ExpressError");

module.exports.validateProduct=(req,res,next)=>{
    let {error}=productSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg); 
    }else{
        next();
    }
}

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in as admin!");
    return res.redirect("/admin/login");
  }
  if (req.user.role !== "admin") {
    req.flash("error", "Access denied.");
    return res.redirect("/");
  }
  next();
};
