import { AdminRole, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { Jwt } from "jsonwebtoken";
import config from "../../../config/index.js";
import ApiError from "../../../errors/ApiError.js";
import { emailHelper } from "../../../helpers/emailHelper.js";
import { jwtHelper } from "../../../helpers/jwtHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { emailTemplate } from "../../shared/emailTemplate.js";
import {
  IAdminLogin,
  IChangePassword,
  ICreateAcademy,
  ICreateAgent,
  ICreateClub,
  ICreateCoach,
  ICreatePlayer,
  IJWTPayload,
  ILogin,
  IResetPassword
} from "./auth.interface.js";

const loginAdmin = async (payload: IAdminLogin) => {
  const { email, password } = payload;

  const isAdminExist = await prisma.superAdmin.findUnique({
    where: { email },
  });

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(password, isAdminExist.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password does not match");
  }

  const accessToken = jwtHelper.createToken(
    { id: isAdminExist.id, role: isAdminExist.adminRole, email: isAdminExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as any
  );

  const refreshToken = jwtHelper.createToken(
    { id: isAdminExist.id, role: isAdminExist.adminRole, email: isAdminExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_refresh_expire_in as any
  );

  return {
    accessToken,
    refreshToken,
    user: isAdminExist,
  };
};

const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email, isDeleted: false },
    include: {
      player: true,
      coach: true,
      club: true,
      academyManager: true,
      agent: true,
    }
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password does not match");
  }

  const accessToken = jwtHelper.createToken(
    { id: isUserExist.id, role: isUserExist.userRole, email: isUserExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as any
  );

  const refreshToken = jwtHelper.createToken(
    { id: isUserExist.id, role: isUserExist.userRole, email: isUserExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_refresh_expire_in as any
  );

  // Update last login
  await prisma.user.update({
    where: { id: isUserExist.id },
    data: { lastLoginAt: new Date() }
  });

  const { password: _, ...userWithoutPassword } = isUserExist;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(token, config.jwt.jwt_secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { id, role } = verifiedToken;

  let isExist;
  if (role === AdminRole.SUPER_ADMIN) {
    isExist = await prisma.superAdmin.findUnique({ where: { id } });
  } else {
    isExist = await prisma.user.findUnique({ where: { id, isDeleted: false } });
  }

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelper.createToken(
    { id: isExist.id, role, email: isExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as any
  );

  const newRefreshToken = jwtHelper.createToken(
    { id: isExist.id, role, email: isExist.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_refresh_expire_in as any
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({ where: { email, isDeleted: false } });
  const isAdminExist = await prisma.superAdmin.findUnique({ where: { email } });

  const user = isUserExist || isAdminExist;

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const role = isUserExist ? isUserExist.userRole : (isAdminExist as any).adminRole;

  const resetToken = jwtHelper.createToken(
    { id: user.id, role, email: user.email },
    config.jwt.jwt_secret as Secret,
    "15m"
  );

  const emailValues = emailTemplate.forgetPassword({ email: user.email, token: resetToken });
  await emailHelper.sendEmail(emailValues);

  return { message: "Reset password link sent to your email" };
};

const resetPassword = async (payload: IResetPassword) => {
  const { email, token, newPassword } = payload;

  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(token, config.jwt.jwt_secret as Secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid or expired reset token");
  }

  if (verifiedToken.email !== email) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid email for this token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt_salt_round);

  if (verifiedToken.role === AdminRole.SUPER_ADMIN) {
    await prisma.superAdmin.update({
      where: { email },
      data: { password: hashedPassword }
    });
  } else {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
  }

  return { message: "Password reset successful" };
};

const changePassword = async (user: IJWTPayload, payload: IChangePassword) => {
  const { oldPassword, newPassword } = payload;

  let isExist;
  if (user.role === AdminRole.SUPER_ADMIN) {
    isExist = await prisma.superAdmin.findUnique({ where: { id: user.id } });
  } else {
    isExist = await prisma.user.findUnique({ where: { id: user.id, isDeleted: false } });
  }

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, isExist.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password does not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt_salt_round);

  if (user.role === AdminRole.SUPER_ADMIN) {
    await prisma.superAdmin.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
  }

  return { message: "Password changed successfully" };
};

// --- Creation Services ---

const createClub = async (creator: IJWTPayload, payload: ICreateClub) => {
  // Only Admin can create Club
  if (creator.role !== AdminRole.SUPER_ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only Admin can create Club");
  }

  const { fullName, email, password, avatar, ...clubData } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        userRole: UserRole.PROFESSIONAL_CLUB,
        isVerified: true,
      }
    });

    const newClub = await tx.club.create({
      data: {
        ...clubData,
        userId: newUser.id,
        name: fullName,
      }
    });

    return { user: newUser, club: newClub };
  });
};

const createAcademy = async (creator: IJWTPayload, payload: ICreateAcademy) => {
  // Admin or Club can create Academy
  const allowed = creator.role === AdminRole.SUPER_ADMIN || creator.role === UserRole.PROFESSIONAL_CLUB;
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only Admin or Club can create Academy");
  }

  const { fullName, email, password, avatar, ...academyData } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        userRole: UserRole.ACADEMY,
        isVerified: true,
      }
    });

    // If Club creates Academy, link it
    let clubId = null;
    if (creator.role === UserRole.PROFESSIONAL_CLUB) {
      const club = await tx.club.findUnique({ where: { userId: creator.id } });
      if (club) clubId = club.id;
    }

    const newAcademy = await tx.academy.create({
      data: {
        ...academyData,
        name: fullName,
        clubId: clubId,
      }
    });

    // Also create AcademyManager
    await tx.academyManager.create({
      data: {
        userId: newUser.id,
        academyId: newAcademy.id
      }
    });

    return { user: newUser, academy: newAcademy };
  });
};

const createPlayer = async (creator: IJWTPayload, payload: ICreatePlayer) => {
  // Admin, Club or Academy can create Player
  const allowed = creator.role === AdminRole.SUPER_ADMIN ||
    creator.role === UserRole.PROFESSIONAL_CLUB ||
    creator.role === UserRole.ACADEMY;
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only Admin, Club or Academy can create Player");
  }

  const { fullName, email, password, avatar, dob, age, ...playerData } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        userRole: UserRole.PLAYER,
        isVerified: true,
      }
    });

    let clubId = null;
    let academyId = null;

    if (creator.role === UserRole.PROFESSIONAL_CLUB) {
      const club = await tx.club.findUnique({ where: { userId: creator.id } });
      if (club) clubId = club.id;
    } else if (creator.role === UserRole.ACADEMY) {
      const academy = await tx.academyManager.findUnique({
        where: { userId: creator.id },
        include: { academy: true }
      });
      if (academy) academyId = academy.academyId;
    }

    const newPlayer = await tx.player.create({
      data: {
        ...playerData,
        userId: newUser.id,
        dob: dob ? new Date(dob) : new Date(),
        age: Number(age) || 0,
        clubId,
        academyId,
      }
    });

    return { user: newUser, player: newPlayer };
  });
};

const createAgent = async (creator: IJWTPayload, payload: ICreateAgent) => {
  // Admin or Club can create Agent
  const allowed = creator.role === AdminRole.SUPER_ADMIN || creator.role === UserRole.PROFESSIONAL_CLUB;
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only Admin or Club can create Agent");
  }

  const { fullName, email, password, avatar, ...agentData } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        userRole: UserRole.AGENT,
        isVerified: true,
      }
    });

    let clubId = null;
    if (creator.role === UserRole.PROFESSIONAL_CLUB) {
      const club = await tx.club.findUnique({ where: { userId: creator.id } });
      if (club) clubId = club.id;
    }

    const newAgent = await tx.agent.create({
      data: {
        ...agentData,
        userId: newUser.id,
        clubId,
      }
    });

    return { user: newUser, agent: newAgent };
  });
};

const createCoach = async (creator: IJWTPayload, payload: ICreateCoach) => {
  // Club or Academy can create Coach
  const allowed = creator.role === UserRole.PROFESSIONAL_CLUB || creator.role === UserRole.ACADEMY;
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only Club or Academy can create Coach");
  }

  const { fullName, email, password, avatar, ...coachData } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        avatar,
        userRole: UserRole.COACH,
        isVerified: true,
      }
    });

    const newCoach = await tx.coach.create({
      data: {
        ...coachData,
        userId: newUser.id,
        fullName,
      }
    });

    // If Club or Academy creates Coach, we might want to link them to a team or something later,
    // but the schema Coach doesn't have a direct clubId/academyId. 
    // It has managedClubs and coachTeams.

    return { user: newUser, coach: newCoach };
  });
};

export const AuthService = {
  loginAdmin,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  createClub,
  createAcademy,
  createPlayer,
  createAgent,
  createCoach,
};
