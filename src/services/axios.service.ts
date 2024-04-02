import axios from "axios";
export const Request = axios.create({
    baseURL: 'https://v2.elis.uaz.ru/api'
});

Request.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('user-token');
Request.interceptors.request.use(config => {
  // NProgress.start()
  return config
})
Request.interceptors.response.use((response) => {
 		// NProgress.done()
    return response;
}, error => {
    // handle the response error
    if(error.response.status == 401 && window.location.pathname !== '/auth'){
       window.location.href = '/auth';
    }
    return Promise.reject(error);

});
