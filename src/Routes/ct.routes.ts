import express from 'express'
import { ctControllers } from '../Controllers/ct.controllers'
import { ctValidators } from '../Validators/ct.validators'
import { multerConfig } from '../config/multer'
import verifyBatch from '../middlewares/verifyBatch'
import verifyCtPermission from '../middlewares/verifyCtPermission'
import verifyInstructor from '../middlewares/verifyInstructor'
import verifyUser from '../middlewares/verifyUser'
const ctRoutes = express.Router()

ctRoutes.post(
  '/',
  ctValidators.validateCreateCt,
  verifyUser('teacher'),
  verifyInstructor,
  ctControllers.createCt,
)
ctRoutes.post(
  '/evaluate-ct/:classTestId',
  multerConfig.uploadExcel.single('excelFile'),
  ctValidators.validateEvaluateCt,
  verifyUser('teacher'),
  verifyInstructor,
  ctControllers.evaluateCt,
)
ctRoutes.get(
  '/results',
  ctValidators.validateGetAllCtResult,
  verifyUser('student'),
  verifyBatch,
  ctControllers.getAllCtResult,
)
ctRoutes.get(
  '/teacher-ct/:courseCode',
  ctValidators.validateGetAllCt,
  verifyUser('teacher'),
  verifyInstructor,
  ctControllers.getAllCt,
)
ctRoutes.get(
  '/final-result/:courseCode',
  ctValidators.validateCalculateFinalResult,
  verifyUser('teacher'),
  verifyInstructor,
  ctControllers.calculateFinalResult,
)
ctRoutes.get(
  '/ct-result/:classTestId',
  ctValidators.validateGetCtResultForTeacher,
  verifyUser('teacher'),
  verifyCtPermission,
  ctControllers.getCtResultForTeacher,
)
export default ctRoutes
