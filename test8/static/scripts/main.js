async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

async function checkUser() {
  const input_username = document.querySelector('#username').value;
  const input_password = document.querySelector('#password').value;
  let response = postData("http://54.147.160.196:5001/api/users/tokens", {
    username: input_username,
    password: input_password
  })
  let data = await response.json();
  document.querySelector('#out').innerHTML = String(data);
}