import { createBrowserHistory } from 'history';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // TODO timeout 설정
  timeout: 30000,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Credentials': true,
  },
});

/* Apply Interceptor */
// HTTP request interceptor
instance.interceptors.request.use(
  (config) => {
    // 추후 로그인 구현시 주석 해제
    // const user = sessionStorage.getItem('user');
    // if (user) {
    //   const Juser = JSON.parse(user);
    //   if (Juser.accessToken) {
    //     config.headers!.Authorization = 'Bearer ' + Juser.accessToken;
    //   }
    // }
    config.headers!.Authorization =
      'Bearer ' +
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGRhbHN0bjYzNTJAbmF2ZXIuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlzcyI6IlRvb2xpdiIsImlhdCI6MTY1MDYxMzEyMiwiZXhwIjoxNjUwNjk5NTIyfQ.gM8fqTDOOyb6RLqlOd7XVFLL6ZsyRQX2MGuUOahUOxzSkLhRjPrc6q5ABQ6E9bIRUgGD8_qgYrMsVtnnk1Pvnw';
    return config;
  },
  (err) => {
    return Promise.reject(err);
    // return false;
  }
);

// HTTP response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response) {
      // const history = createBrowserHistory();
      console.log(error.response);
      switch (error.response.status) {
        /* 'JWT expired' exeption */
        case 400:
          console.log('400 ERROR, not authorized.');
          break;
        case 401:
          console.log('401 ERROR, not authorized.');
          // history.push('/signup');
          // // 강제로 새로고침 (임시)
          // window.location.reload();
          // sessionStorage.removeItem('user');
          break;
        case 404:
          console.log('404error!');
          break;
        case 409:
          console.log('409error!');
          break;
        default:
      }
    } else {
      // ex. 서버 키지 않은 경우
    }
    return Promise.reject(error);
    // return false;
  }
);

export const multipartInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // TODO timeout 설정
  timeout: 30000,
  headers: {
    'Content-Type': `multipart/form-data`,
  },
});

export default instance;