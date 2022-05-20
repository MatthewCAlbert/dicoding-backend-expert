const jwtValidation = (artifacts) => ({
  isValid: true,
  credentials: {
    id: artifacts.decoded.payload.id,
  },
});

module.exports = jwtValidation;
