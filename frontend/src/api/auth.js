// const roles = {
//   0: "LOGIN",
//   1: "USER",
//   2: "MANAGER",
// };

export async function login(login, password) {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: login, password}),
      credentials: 'include'
    })
    const user = users.find(u => u.login === login && u.password === password);
    if (user){
        // eslint-disable-next-line no-unused-vars
        const {password, ...dtoUser} = user
        dtoUser.role = roles[user.roleID];
        return Promise.resolve(dtoUser)

    }
    Promise.reject("user not found or wrong password")
}