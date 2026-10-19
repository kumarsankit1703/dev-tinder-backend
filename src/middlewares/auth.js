const adminAuth = (req, res, next) => {
    console.log("admin auth checkd")
  const token = "abc";
  const isAutherized = token == "abc";
  if (!isAutherized) {
    res.status(401).send("user is not Autherized");
  } else {
    next();
  }
}

module.exports= adminAuth