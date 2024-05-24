export const isAuthorize = (...role) => {
  return async (req, res, next) => {
    if (!role.includes(req.userData.role))
      return next(new Error("Not Authorize", { cause: 403 }));
    return next();
  };
};
