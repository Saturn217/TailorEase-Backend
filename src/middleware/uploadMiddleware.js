


const handleUpload = (uploadFn) => {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message })
      }
      next()
    })
  }
}

module.exports = handleUpload