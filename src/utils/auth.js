class Auth {
  constructor(options) {
    this.options = options;
  }

  register(email, password) {
    return this.request('/signup', 'POST', JSON.stringify(email, password));
  }

  authorize(email, password) {
    return this.request('/signin', 'POST', JSON.stringify(email, password));
  }

  getContent(token) {
    return fetch('https://register.nomoreparties.co/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const body = await res.json();
      return Promise.reject(body.error || body.message);
    });
  }

  request(auth, method, body) {
    return fetch(`${this.options.baseUrl}${auth}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      body,
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const body = await res.json();
      return Promise.reject(body.error || body.message);
    });
  }
}
const auth = new Auth({
  baseUrl: 'https://register.nomoreparties.co',
});

export default auth;


// class Auth {
//     constructor(baseUrl) {
//   // constructor({ baseUrl, headers }) {
//     this.baseUrl = baseUrl;
//     // this._headers = headers;
//   }

//   register(email, password) {
//     return (
//       fetch(`${this._baseUrl}/signup`, {
//         method: 'POST',
//         // headers: this._headers,
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: email, password: password }),
//       })
//         // .then((res) =>
//         //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//         // )
//         .then((res) => {
//           if (res.status === 201) {
//             return res.json();
//           } else {
//             throw new Error('Unsuccessful registration');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     );
//   }

//   authorize(email, password) {
//     return (
//       fetch(`${this._baseUrl}/signin`, {
//         method: 'POST',
//         // headers: this._headers,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: email, password: password }),
//       })
//         // .then((res) =>
//         //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//         // )
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           } else {
//             throw new Error('Unsuccessful login');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//         .then((data) => {
//           localStorage.setItem('token', data.token);
//           return true;
//         })
//     );
//   }

//   getContent(token) {
//     return (
//       fetch(`${this._baseUrl}/users/me`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         // .then(async (res) => {
//         //   if (res.ok) {
//         //     return res.json();
//         //   }
//         //   const body = await res.json();
//         //   return Promise.reject(body.error || body.message);
//         // })
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     );
//   }
// }
// const auth = new Auth({
//   baseUrl: 'https://register.nomoreparties.co',
//   // headers: {
//   //   'Content-Type': 'application/json',
//   // },
// });

// export default auth;


// class Auth {
//   constructor({ baseUrl, headers }) {
//     this.baseUrl = baseUrl;
//     this._headers = headers;
//   }

//   register(email, password) {
//     return fetch(`${this._baseUrl}/signup`, {
//       method: 'POST',
//       headers: this._headers,
//       body: JSON.stringify(email, password),
//     })
//       // .then((res) =>
//       //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//       // )
//       .then((res) => {
//         if (res.status === 201) {
//             return res.json();
//         } else {
//             throw new Error('Unsuccessful registration');
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   authorize(email, password) {
//     return (
//       fetch(`${this._baseUrl}/signin`, {
//         method: 'POST',
//         headers: this._headers,
//         body: JSON.stringify({ password: password, email: email }),
//       })
//         // .then((res) =>
//         //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//         // )
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           } else {
//             throw new Error('Unsuccessful login');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//         .then((data) => {
//           localStorage.setItem('token', data.token);
//           return true;
//         })
//     );
//   }

//   getContent(token) {
//     return (
//       fetch(`${this._baseUrl}/users/me`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         // .then(async (res) => {
//         //   if (res.ok) {
//         //     return res.json();
//         //   }
//         //   const body = await res.json();
//         //   return Promise.reject(body.error || body.message);
//         // })
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     );
//   }
// }
// const auth = new Auth({
//   baseUrl: 'https://register.nomoreparties.co',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default auth;


// class Auth {
//   constructor({ baseUrl, headers }) {
//     this.baseUrl = baseUrl;
//     this._headers = headers;
//   }

//   register(email, password) {
//     return (
//       fetch(`${this._baseUrl}/signup`, {
//         method: 'POST',
//         headers: this._headers,
//         body: JSON.stringify({ email, password }),
//       })
//         // .then((res) =>
//         //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//         // )
//         .then((res) => {
//           if (res.status === 201) {
//             return res.json();
//           } else {
//             throw new Error('Unsuccessful registration');
//           }
//         })
//         .catch((err) => console.log(err))
//     );
//   }

//   authorize(email, password) {
//     return (
//       fetch(`${this._baseUrl}/signin`, {
//         method: 'POST',
//         headers: this._headers,
//         body: JSON.stringify({ password, email }),
//       })
//         // .then((res) =>
//         //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
//         // )
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           } else {
//             throw new Error('Unsuccessful login');
//           }
//         })
//         // .then((data) => {
//         //   localStorage.setItem('token', data.token);
//         //   return true;
//         // })
//         .then((data) => {
//           if (!data.message) {
//             localStorage.setItem('token', data.token);
//             return data;
//           } else {
//             return;
//           }
//         })
//         .catch((err) => console.log(err))
//     );
//   }

//   getContent(token) {
//     return (
//       fetch(`${this._baseUrl}/users/me`, {
//         method: 'GET',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         // .then(async (res) => {
//         //   if (res.ok) {
//         //     return res.json();
//         //   }
//         //   const body = await res.json();
//         //   return Promise.reject(body.error || body.message);
//         // })
//         .then((res) => {
//           if (res.status === 200) {
//             return res.json();
//           }
//         })
//         .then((data) => data)
//         .catch((err) => console.log(err))
//     );
//   }
// }
// const auth = new Auth({
//   baseUrl: 'https://register.nomoreparties.co',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default auth;
