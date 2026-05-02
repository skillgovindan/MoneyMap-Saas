import apiClient from '../api/apiClient';

class DailyReportRepository {
  async getDailyReport(date) {
    const response = await apiClient.get(`/api/reports/daily?date=${date}`);
    return response.data;
  }
}

export default new DailyReportRepository();
