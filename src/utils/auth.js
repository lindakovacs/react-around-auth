class Auth {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this._headers = headers;
  }

  register(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(email, password),
    })
      // .then((res) =>
      //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
      // )
      .then((res) => {
        if (res.status === 201) {
            return res.json();
        } else {
            throw new Error('Unsuccessful registration');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  authorize(email, password) {
    return (
      fetch(`${this._baseUrl}/signin`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({ password: password, email: email }),
      })
        // .then((res) =>
        //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
        // )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error('Unsuccessful login');
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then((data) => {
          localStorage.setItem('token', data.token);
          return true;
        })
    );
  }

  getContent(token) {
    return (
      fetch(`${this._baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        // .then(async (res) => {
        //   if (res.ok) {
        //     return res.json();
        //   }
        //   const body = await res.json();
        //   return Promise.reject(body.error || body.message);
        // })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}
const auth = new Auth({
  baseUrl: 'https://register.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default auth;
