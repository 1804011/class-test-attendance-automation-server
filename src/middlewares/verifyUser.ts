import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { Role } from '../Interfaces/Roles.interface'
import { ErrorResponse } from '../Interfaces/responses.interfaces'
import { userServices } from '../Services/user.services'
import config from '../config'
import ApiError from '../errors/ApiError'
const verifyUser = (...roles: Role[]) => {
  const verifyUserMiddleware: RequestHandler = async (req, res, next) => {
    const token =
      req.headers.authorization?.split(' ')[1] || req?.cookies?.token
    if (!token) {
      const errorResponse: ErrorResponse = {
        statusCode: 401,
        success: false,
        message: 'Token not provided',
      }
      res.status(401).json(errorResponse)
    } else {
      jwt.verify(
        token,
        config.jwtSecret as jwt.Secret,
        async (
          err: jwt.VerifyErrors | null,
          decoded: jwt.JwtPayload | unknown,
        ) => {
          if (err) {
            const errorResponse: ErrorResponse = {
              statusCode: 401,
              success: false,
              message: 'Invalid token',
            }
            res.status(401).json(errorResponse)
          } else {
            try {
              const { role, id } = decoded as jwt.JwtPayload
              if (!roles.includes(role)) {
                throw new ApiError(
                  httpStatus.UNAUTHORIZED,
                  `Only ${roles} can access this route`,
                )
              } else if (role === 'student') {
                req.user = await userServices.getSingleStudent(id)
              } else if (role === 'teacher') {
                req.user = await userServices.getSingleTeacher(id)
              }

              next()
            } catch (error) {
              next(error)
            }
          }
        },
      )
    }
  }
  return verifyUserMiddleware
}
export default verifyUser
