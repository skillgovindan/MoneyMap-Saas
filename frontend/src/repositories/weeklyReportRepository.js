import apiClient from '../api/apiClient';

class WeeklyReportRepository {
  async getWeeklyReport(startDate, endDate) {
    const response = await apiClient.get(`/api/reports/weekly?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }
}

export default new WeeklyReportRepository();
