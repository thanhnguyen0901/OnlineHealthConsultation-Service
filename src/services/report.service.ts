import prisma from '../config/db';

export class ReportService {
  /**
   * Get overall statistics
   */
  async getOverallStats() {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalSpecialties,
      totalQuestions,
      totalAppointments,
      totalRatings,
      pendingAppointments,
      completedAppointments,
      answeredQuestions,
      pendingQuestions,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.doctorProfile.count(),
      prisma.patientProfile.count(),
      prisma.specialty.count({ where: { isActive: true } }),
      prisma.question.count(),
      prisma.appointment.count(),
      prisma.rating.count({ where: { status: 'VISIBLE' } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.question.count({ where: { status: 'ANSWERED' } }),
      prisma.question.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      users: {
        total: totalUsers,
        doctors: totalDoctors,
        patients: totalPatients,
      },
      specialties: totalSpecialties,
      consultations: {
        totalQuestions,
        answeredQuestions,
        pendingQuestions,
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        completed: completedAppointments,
      },
      ratings: {
        total: totalRatings,
      },
    };
  }

  /**
   * Get consultations statistics with time range
   */
  async getConsultationsStats(from?: Date, to?: Date) {
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    const questions = await prisma.question.findMany({
      where,
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by date
    const groupedByDate: { [key: string]: { total: number; answered: number; pending: number } } = {};

    questions.forEach((q) => {
      const date = q.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = { total: 0, answered: 0, pending: 0 };
      }
      groupedByDate[date].total++;
      if (q.status === 'ANSWERED') groupedByDate[date].answered++;
      if (q.status === 'PENDING') groupedByDate[date].pending++;
    });

    // Convert to array format
    const data = Object.entries(groupedByDate)
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }

  /**
   * Get active users statistics with time range
   */
  async getActiveUsersStats(from?: Date, to?: Date) {
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    // Count users who created questions or appointments
    const [usersWithQuestions, usersWithAppointments] = await Promise.all([
      prisma.question.groupBy({
        by: ['patientId'],
        where,
        _count: true,
      }),
      prisma.appointment.groupBy({
        by: ['patientId'],
        where,
        _count: true,
      }),
    ]);

    const activePatients = new Set([
      ...usersWithQuestions.map((q) => q.patientId),
      ...usersWithAppointments.map((a) => a.patientId),
    ]);

    // Get doctor activity
    const [doctorsWithAnswers, doctorsWithAppointments] = await Promise.all([
      prisma.answer.groupBy({
        by: ['doctorId'],
        where,
        _count: true,
      }),
      prisma.appointment.groupBy({
        by: ['doctorId'],
        where,
        _count: true,
      }),
    ]);

    const activeDoctors = new Set([
      ...doctorsWithAnswers.map((a) => a.doctorId),
      ...doctorsWithAppointments.map((a) => a.doctorId),
    ]);

    return {
      activePatients: activePatients.size,
      activeDoctors: activeDoctors.size,
      totalActiveUsers: activePatients.size + activeDoctors.size,
    };
  }

  /**
   * Get general statistics (same as overall stats for compatibility)
   */
  async getStatistics() {
    return this.getOverallStats();
  }

  /**
   * Get appointments chart data
   */
  async getAppointmentsChart(from?: Date, to?: Date) {
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by date and status
    const groupedByDate: { [key: string]: any } = {};

    appointments.forEach((a) => {
      const date = a.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };
      }
      groupedByDate[date].total++;
      groupedByDate[date][a.status.toLowerCase()]++;
    });

    // Convert to array format suitable for charts
    const data = Object.values(groupedByDate).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    return data;
  }

  /**
   * Get questions chart data
   */
  async getQuestionsChart(from?: Date, to?: Date) {
    const where: any = {};

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    const questions = await prisma.question.findMany({
      where,
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by date and status
    const groupedByDate: { [key: string]: any } = {};

    questions.forEach((q) => {
      const date = q.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          total: 0,
          pending: 0,
          answered: 0,
          moderated: 0,
        };
      }
      groupedByDate[date].total++;
      groupedByDate[date][q.status.toLowerCase()]++;
    });

    // Convert to array format suitable for charts
    const data = Object.values(groupedByDate).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    return data;
  }

  /**
   * Get top rated doctors
   */
  async getTopRatedDoctors(limit: number = 10) {
    const doctors = await prisma.doctorProfile.findMany({
      where: {
        ratingCount: {
          gt: 0,
        },
      },
      take: limit,
      orderBy: [
        {
          ratingAverage: 'desc',
        },
        {
          ratingCount: 'desc',
        },
      ],
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        specialty: true,
      },
    });

    return doctors.map((d) => ({
      id: d.id,
      doctorName: d.user.fullName,
      specialty: d.specialty.name,
      ratingAverage: d.ratingAverage,
      ratingCount: d.ratingCount,
      yearsOfExperience: d.yearsOfExperience,
    }));
  }

  /**
   * Get specialty distribution
   */
  async getSpecialtyDistribution() {
    const specialties = await prisma.specialty.findMany({
      include: {
        doctors: {
          select: {
            id: true,
          },
        },
      },
    });

    return specialties.map((s) => ({
      name: s.name,
      doctorCount: s.doctors.length,
    }));
  }
}

export default new ReportService();
