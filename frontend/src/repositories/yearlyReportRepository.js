import apiClient from '../api/apiClient';

class YearlyReportRepository {
  async getYearlyReport(year) {
    const response = await apiClient.get(`/api/reports/yearly?year=${year}`);
    return response.data;
  }
}

export default new YearlyReportRepository();
