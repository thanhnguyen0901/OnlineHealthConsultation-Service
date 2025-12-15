import { Request, Response } from 'express';
import reportService from '../services/report.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/error.middleware';

export class ReportController {
  /**
   * Get overall statistics
   * GET /admin/stats
   */
  getOverallStats = asyncHandler(async (_req: Request, res: Response) => {
    const result = await reportService.getOverallStats();
    sendSuccess(res, result);
  });

  /**
   * Get consultations statistics
   * GET /admin/stats/consultations
   */
  getConsultationsStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const result = await reportService.getConsultationsStats(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined
    );
    sendSuccess(res, result);
  });

  /**
   * Get active users statistics
   * GET /admin/stats/active-users
   */
  getActiveUsersStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const result = await reportService.getActiveUsersStats(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined
    );
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
    const { from, to } = req.query;
    const result = await reportService.getAppointmentsChart(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined
    );
    sendSuccess(res, result);
  });

  /**
   * Get questions chart data
   * GET /reports/questions-chart
   */
  getQuestionsChart = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const result = await reportService.getQuestionsChart(
      from ? new Date(from as string) : undefined,
      to ? new Date(to as string) : undefined
    );
    sendSuccess(res, result);
  });

  /**
   * Get top rated doctors
   * GET /reports/top-doctors
   */
  getTopRatedDoctors = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;
    const result = await reportService.getTopRatedDoctors(
      limit ? parseInt(limit as string) : undefined
    );
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
