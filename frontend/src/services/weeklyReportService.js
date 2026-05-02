import weeklyReportRepository from '../repositories/weeklyReportRepository';

class WeeklyReportService {
  async getWeeklyReport(startDate, endDate) {
    try {
      if (!startDate) {
        throw new Error('Start date is required.');
      }
      if (!endDate) {
        throw new Error('End date is required.');
      }
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error('End date cannot be before start date.');
      }
      
      const data = await weeklyReportRepository.getWeeklyReport(startDate, endDate);
      return data;
    } catch (error) {
      console.error('Error fetching weekly report:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch weekly report.');
    }
  }
}

export default new WeeklyReportService();
