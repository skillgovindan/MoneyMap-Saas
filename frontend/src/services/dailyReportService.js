import dailyReportRepository from '../repositories/dailyReportRepository';

class DailyReportService {
  async getDailyReport(date) {
    try {
      if (!date) {
        throw new Error('Date is required to fetch daily report.');
      }
      
      const data = await dailyReportRepository.getDailyReport(date);
      return data;
    } catch (error) {
      console.error('Error fetching daily report:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch daily report.');
    }
  }
}

export default new DailyReportService();
