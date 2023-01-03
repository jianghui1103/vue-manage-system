import http from '@/axios/index';

export default class playable {
  /**
   * 获取pl下载链接
   * @param {String} params 
   * @returns
   */
  static async downLoadZip(params: unknown) {
    return http.get('/api/DownLoadZip', params);
  }
}