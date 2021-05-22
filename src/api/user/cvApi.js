import axiosClient from './../axiosClient';
const cvApi = {
    getCV(params) {
      const url = `/user/cv/${params.id}`;
      return axiosClient.get(url);
    },
    createCV(params) {
        const url = `/user/cv/create`;
        return axiosClient.post(url,params);
    },
    updateCV(params) {
        const url = `/user/cv/update`;
        return axiosClient.post(url,params);
    },
};
  
export default cvApi;