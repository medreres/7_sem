import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Підвищення до 10 VUs
    { duration: '1m', target: 50 }, // Підвищення до 50 VUs
    { duration: '1m', target: 0 },  // Спад
  ],
};

export default function () {
  let res = http.get('http://localhost:4000/products/123');
  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(1); // Think time
}
