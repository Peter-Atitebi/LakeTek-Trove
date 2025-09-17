module.exports = (req, res, next) => {
  // list of authorized emails
  const authorizedEmails = [
    "laketeknologies@gmail.com",
    "lakehub07@gmail.com",
  ];

  // list of verification codes
  const authorizedCodes = [
    // implement third service to generate dynamic codes
    "LT2025",
    "LT2026",
    "LT2054",
  ];

  // check if email is authorized and code is correct
  if (!authorizedEmails.includes(req.body.email)) {
    return res
      .status(400)
      .json({ success: false, message: "You are not authorized" });
  }

  // check if the code is correct
  if (authorizedCodes.includes(req.body.code)) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid code",
    });
  }
};
