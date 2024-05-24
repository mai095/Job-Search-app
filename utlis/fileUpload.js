import multer, { diskStorage } from "multer";

export const filterValidation ={
  images:["image/png", "image/jpeg"],
  files:['application/pdf']
}
export const fileUpload = ({filter}) => {
  const filefilter = (req, file, cb) => {
    if (!filter.includes(file.mimetype))
      return cb(new Error("Invalid Formate"), false);
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), filefilter });
};
