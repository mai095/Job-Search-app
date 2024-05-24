import { application } from "express";
import { appModel } from "../../../DB/models/application.model.js";
import { companyModel } from "../../../DB/models/company.model.js";
import { jobModel } from "../../../DB/models/job.model.js";
import cloudinary from "../../../utlis/cloud.js";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// ^addJob
export const addJob = async (req, res, next) => {
  //create in DB
  await jobModel.create({
    ...req.body,
    addedBy: req.userData._id,
    companyId: req.params.companyId,
  });
  //res
  return res.json({
    success: true,
    message: "Job created successfully",
  });
};

// ^update
export const updateJob = async (req, res, next) => {
  //check job
  const job = await jobModel.findById(req.params.id);
  if (!job) return next(new Error("Job not found", { cause: 400 }));
  //check owner
  if (job.addedBy.toString() !== req.userData._id.toString())
    return next(new Error("Not allowed to update job", { cause: 403 }));
  //update&save
  await jobModel.findByIdAndUpdate(job._id, { ...req.body }, { new: true });
  //res
  return res.json({
    success: true,
    message: "Job updated successfully",
  });
};

// ^delete
export const deleteJob = async (req, res, next) => {
  //check job
  const job = await jobModel.findById(req.params.id);
  if (!job) return next(new Error("Job not found", { cause: 400 }));
  //check owner
  if (job.addedBy.toString() !== req.userData._id.toString())
    return next(new Error("Not allowed to delete job", { cause: 403 }));
  //delete
  await job.deleteOne();
  return res.json({
    success: true,
    message: "Job deleted successfully",
  });
};

// ^get all job with company data
export const jobWithData = async (req, res, next) => {
  const job = await jobModel.find().populate("companyId");
  if (!job) return next(new Error("job not found", { cause: 404 }));

  return res.json({
    success: true,
    job,
  });
};

// ^Get all Jobs for a specific company
export const jobWithSpecificCompany = async (req, res, next) => {
  // check company
  const company = await companyModel.find({
    companyName: req.query.companyName,
  });

  if (company.length == 0)
    return next(new Error("Company not found", { cause: 404 }));

  //get  jobs
  const job = await jobModel.find({ addBy: company.companyHr });
  //res
  return res.json({
    success: true,
    job,
  });
};

// ^filter
export const filterJob = async (req, res, next) => {
  const job = await jobModel.find({ ...req.query });

  if (job.length == 0) return next(new Error("Job not found", { cause: 404 }));
  //res
  return res.json({
    success: true,
    job,
  });
};

// ^Apply to Job
export const applyJob = async (req, res, next) => {
  //check job
  const job = await jobModel.findById(req.params.jobId);
  if (!job) return next(new Error("Job not found", { cause: 404 }));

  //upload pdf on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER}/${job._id}/resumePdf`,
    }
  );

  //create
  const appJob = await appModel.create({
    jobId: req.params.jobId,
    userId: req.userData._id,
    userTechSkills: req.body.userTechSkills,
    userSoftSkills: req.body.userSoftSkills,
    userResume: { url: secure_url, id: public_id },
  });

  return res.json({
    message: "job applied successfully",
    appJob,
  });
};

// ^get application for specific company 
export const applications = async (req, res, next) => {
  const company = await companyModel.findById(req.params.companyId);
  if (!company) return next(new Error("Company not found", { cause: 404 }));

  const jobs = await jobModel.find({ addedBy: company.companyHR });
  if (!jobs)
    return next(new Error("This company doesn't have any job", { cause: 404 }));

  const applications = [];
  for (const job of jobs) {
    const application = await appModel
      .find({ jobId: job._id })
      .populate([{ path: "userId"}, {path: "jobId" }]);
    applications.push(application);
  }

  //*create excel sheet
  const workbook = new ExcelJS.Workbook();
  const workSheet = workbook.addWorksheet("Resume Sheet");
  //*columns
  workSheet.columns = [
    { header: "User Name", key: "userName", width: 20 },
    { header: "User Resume", key: "userResume", width: 100 },
    { header: "Applied Job", key: "job", width: 20 },
  ];
  //*row
  const data = [];
  for (const inApplication of applications) {
    for (const application of inApplication) {
      const entryData = {
        userName: application.userId.userName,
        userResume: application.userResume.url,
        job: application.jobId.jobTitle,
      };
      data.push(entryData);
    }
  }

  workSheet.addRows(data);
  const excelPath = path.join(__dirname, `../../../applications/app.xlsx`);
  await workbook.xlsx.writeFile(`${excelPath}`);

  //res
  return res.json({
    success: true,
    message: "Done",
  });
};
