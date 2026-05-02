import monthlyReportRepository from '../repositories/monthlyReportRepository';

class MonthlyReportService {
  async getMonthlyReport(year, month) {
    try {
      if (!year) {
        throw new Error('Year is required.');
      }
      if (!month) {
        throw new Error('Month is required.');
      }
      
      const numMonth = Number(month);
      if (numMonth < 1 || numMonth > 12) {
        throw new Error('Month must be between 1 and 12.');
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (Number(year) > currentYear || (Number(year) === currentYear && numMonth > currentMonth)) {
        throw new Error('Cannot select a future month or year.');
      }
      
      const data = await monthlyReportRepository.getMonthlyReport(year, month);
      return data;
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch monthly report.');
    }
  }
}

export default new MonthlyReportService();
