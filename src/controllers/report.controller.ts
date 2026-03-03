import { Request, Response } from 'express';
import { z } from 'zod';
import reportService from '../services/report.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';

// Validation schema for reports query
export const getReportsQuerySchema = z.object({
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

/**
 * Shared schema for endpoints that accept an optional date range (from / to).
 *
 * Accepts any string that JavaScript's Date constructor can parse
 * (ISO-8601 recommended: "2026-01-01" or "2026-01-01T00:00:00Z").
 * Invalid strings are rejected immediately with a 400 so they never reach
 * Prisma as `Invalid Date`.
 */
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

/** Schema for the top-doctors endpoint: optional numeric limit (1-100). */
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
  /**
   * Get aggregated reports with optional date filtering
   * GET /reports?startDate=2024-01-01&endDate=2024-12-31
   */
  getReports = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const result = await reportService.getReports(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    sendSuccess(res, result);
  });

  /**
   * Get overall statistics
   * GET /reports/stats  (canonical — previously also served at /admin/stats, now removed per AUDIT-08)
   */
  getOverallStats = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getOverallStats();
    sendSuccess(res, result);
  });

  /**
   * Get consultations statistics
   * GET /reports/stats/consultations
   */
  getConsultationsStats = asyncHandler(async (req: Request, res: Response) => {
    // from/to are already validated Date | undefined by dateRangeQuerySchema
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getConsultationsStats(from, to);
    sendSuccess(res, result);
  });

  /**
   * Get active users statistics
   * GET /reports/stats/active-users
   */
  getActiveUsersStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getActiveUsersStats(from, to);
    sendSuccess(res, result);
  });

  /**
   * Get general statistics
   * GET /reports/statistics
   */
  getStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getStatistics();
    sendSuccess(res, result);
  });

  /**
   * Get appointments chart data
   * GET /reports/appointments-chart
   */
  getAppointmentsChart = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getAppointmentsChart(from, to);
    sendSuccess(res, result);
  });

  /**
   * Get questions chart data
   * GET /reports/questions-chart
   */
  getQuestionsChart = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query as { from?: Date; to?: Date };
    const result = await reportService.getQuestionsChart(from, to);
    sendSuccess(res, result);
  });

  /**
   * Get top rated doctors
   * GET /reports/top-doctors
   */
  getTopRatedDoctors = asyncHandler(async (req: Request, res: Response) => {
    // limit is already validated and parsed to number | undefined by topDoctorsQuerySchema
    const { limit } = req.query as { limit?: number };
    const result = await reportService.getTopRatedDoctors(limit);
    sendSuccess(res, result);
  });

  /**
   * Get specialty distribution
   * GET /reports/specialty-distribution
   */
  getSpecialtyDistribution = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getSpecialtyDistribution();
    sendSuccess(res, result);
  });
}

export default new ReportController();
