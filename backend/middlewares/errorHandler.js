
module.exports = (err, req, res, next) => {
  console.error(err); // always log server-side
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      details: err.details || undefined,
    }
  });
};
