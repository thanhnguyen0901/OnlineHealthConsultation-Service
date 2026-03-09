import { Request, Response } from 'express';
import { z } from 'zod';
import reportService from '../services/report.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';

export const getReportsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Invalid date strings are rejected with 400 before reaching Prisma as `Invalid Date`.
export const dateRangeQuerySchema = z.object({
  from: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || !isNaN(new Date(val).getTime()),
      { message: "'from' must be a valid date string (e.g. 2026-01-01)" }
    )
    .transform((val) => (val ? new Date(val) : undefined)),
  to: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || !isNaN(new Date(val).getTime()),
      { message: "'to' must be a valid date string (e.g. 2026-01-01)" }
    )
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const topDoctorsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || (!isNaN(Number(val)) && Number.isInteger(Number(val))),
      { message: "'limit' must be an integer" }
    )
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(100).optional()),
});

export class ReportController {
  getReports = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getReports(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    sendSuccess(res, result);
  });

  getOverallStats = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getOverallStats();
    sendSuccess(res, result);
  });

  getConsultationsStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getConsultationsStats(from, to);
    sendSuccess(res, result);
  });

  getActiveUsersStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getActiveUsersStats(from, to);
    sendSuccess(res, result);
  });

  getStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getStatistics();
    sendSuccess(res, result);
  });

  getAppointmentsChart = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getAppointmentsChart(from, to);
    sendSuccess(res, result);
  });

  getQuestionsChart = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getQuestionsChart(from, to);
    sendSuccess(res, result);
  });

  getTopRatedDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query as { limit?: number };
    const result = await reportService.getTopRatedDoctors(limit);
    sendSuccess(res, result);
  });

  getSpecialtyDistribution = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getSpecialtyDistribution();
    sendSuccess(res, result);
  });
}

export default new ReportController();
