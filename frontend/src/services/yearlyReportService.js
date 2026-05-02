import yearlyReportRepository from '../repositories/yearlyReportRepository';

class YearlyReportService {
  async getYearlyReport(year) {
    try {
      if (!year) {
        throw new Error('Year is required.');
      }
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      if (Number(year) > currentYear) {
        throw new Error('Cannot select a future year.');
      }
      
      const data = await yearlyReportRepository.getYearlyReport(year);
      return data;
    } catch (error) {
      console.error('Error fetching yearly report:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch yearly report.');
    }
  }
}

export default new YearlyReportService();
