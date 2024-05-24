import { companyModel } from "../../../DB/models/company.model.js";
import { userModel } from "../../../DB/models/user.model.js";

// ^addCompany
export const addCompany = async (req, res, next) => {
  //check company name & email
  const company = await companyModel.findOne({
    $or: [
      {
        companyName: req.body.companyName,
      },
      { companyEmail: req.body.companyEmail },
    ],
  });

  if (company)
    return next(
      new Error("Dublicated data ,Email or Company Name", { cause: 400 })
    );

  //create DB
  const results = await companyModel.create({
    ...req.body,
    companyHR: req.userData._id,
  });

  res.json({
    success: true,
    message: "Company Created",
  });
};

// ^update
export const updateCompany = async (req, res, next) => {
  //check company
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  //check owner
  if (company.companyHR.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this company!", { cause: 403 })
    );

  //check company name & email
  const dublicate = await companyModel.findOne({
    $or: [
      {
        companyName: req.body.companyName,
      },
      { companyEmail: req.body.companyEmail },
    ],
  });

  if (dublicate)
    return next(
      new Error("Dublicated data ,Email or Company Name", { cause: 400 })
    );

  //update DB &save
  await companyModel.findByIdAndUpdate(
    company._id,
    { ...req.body },
    { new: true }
  );
  //res
  return res.json({
    success: true,
    message: "Company updated successfully!",
  });
};

// ^delete
export const deleteCompany = async (req, res, next) => {
  //check company
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new Error("Company not found", { cause: 404 }));
  //check owner
  if (company.companyHR.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to update this company!", { cause: 403 })
    );
  //delete
  await companyModel.findByIdAndDelete(company._id, { new: true });
  //res
  return res.json({
    success: true,
    message: "Company deleted successfully!",
  });
};

// ^get
export const getCompanyData = async (req, res, next) => {
  //check company
  const company = await companyModel.findById(req.params.id);
  if (!company) return next(new Error("Company not found", { cause: 404 }));
  
  //get data
  //   !return all jobs related to this company
  const jobs = await companyModel.findById(company._id).populate("job");
  //res
  return res.json({
    sucesss: true,
    jobs,
  });
};

// ^searchByName
export const searchByName = async (req, res, next) => {
  //check name
  const company = await companyModel.findOne({
    companyName: req.query.companyName.toLowerCase(),
  });
  if (!company)
    return next(new Error("Company name not found", { cause: 404 }));
  //res
  return res.json({
    success: true,
    company,
  });
};

// ^Get all applications for specific Jobs
export const application = async (req, res, next) => {
  //check the owner
  const companyOwner = await userModel.findById(req.userData._id);

  //get data
  const companies = await companyModel
    .find({ companyHR: companyOwner })
    .populate({
      path: "job",
      populate: { path: "application", populate: { path: "userId" } },
    });

  if (companies.length == 0)
    return next(
      new Error("Not allowed to see other company's jobs", { cause: 403 })
    );
  //res
  return res.json({
    success: true,
    companies,
  });
};
