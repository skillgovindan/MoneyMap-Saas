import apiClient from '../api/apiClient';

class MonthlyReportRepository {
  async getMonthlyReport(year, month) {
    const response = await apiClient.get(`/api/reports/monthly?year=${year}&month=${month}`);
    return response.data;
  }
}

export default new MonthlyReportRepository();
