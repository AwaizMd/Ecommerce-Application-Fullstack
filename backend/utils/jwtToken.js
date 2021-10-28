//Creating token and saving in cookie.

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), //if we give cookie_expire = 7 it will expire in 7 days. 
    httpOnly: true,
  };
  res.status(statusCode).cookie('token',token,options).json({
      success:true,
      user,
      token,
  })
};

module.exports = sendToken;