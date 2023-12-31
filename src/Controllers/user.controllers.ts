import { Student, Teacher } from '@prisma/client'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { sendSuccessResponse } from '../Services/response.services'
import { userServices } from '../Services/user.services'
import { hashPassword } from '../Services/utils.services'
import catchAsync from '../Shared/catchAsync'

const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const { password, deptHead = 'false', ...others } = req.body
  const result = await userServices.createTeacher({
    ...others,
    password: hashPassword(password),
    role: 'teacher',
    deptHead: (deptHead as string).toLowerCase() === 'true',
  })
  sendSuccessResponse<Omit<Teacher, 'password'>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher created successfully',
    data: result,
  })
})
const createStudent = catchAsync(async (req: Request, res: Response) => {
  const { password, ...others } = req.body
  const result = await userServices.createStudent({
    ...others,
    password: hashPassword(password),
    role: 'student',
  })

  sendSuccessResponse<Omit<Student, 'password'>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: 'Student created successfully',
  })
})
const deleteTeacher = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.params
  const result = await userServices.deleteTeacher(teacherId)

  sendSuccessResponse<Omit<Teacher, 'password'>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: 'Teacher deleted successfully',
  })
})
const makeHead = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.params
  const result = await userServices.makeHead(teacherId)
  sendSuccessResponse<Omit<Teacher, 'password'>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: 'Head is assigned successfully',
  })
})

export const userControllers = {
  createTeacher,
  createStudent,
  makeHead,
  deleteTeacher,
}
