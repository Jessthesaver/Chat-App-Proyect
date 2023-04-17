import { RESTDataSource } from "@apollo/datasource-rest";

class UserAPI extends RESTDataSource {
  baseURL = process.env.API_USERS;

  constructor(options = {}) {
    super(options);
    //this.memoizeGetRequests;
  }

  async createUser(username, name, email, avatar) {
    return this.post(`/api/users/`, {
      body: {
        username,
        name,
        email,
        avatar,
      },
    });
  }

  async getUser(userInput) {
    const user = userInput.username ? userInput.username : userInput;
    return this.get(`/api/users/getUser/${user}`);
  }

  async updateInfo(username, infoToupdate) {
    return this.patch(`/api/users/update/${username}`, { body: infoToupdate });
  }

  async friendRequest(friendInput) {
    return this.post(`api/users/friendRequest`, { body: friendInput });
  }

  async acceptFriend(friendInput) {
    return this.patch(`api/users/acceptFriend`, { body: friendInput });
  }

  async rejectFriend(friendInput) {
    return this.post(`api/users/rejectFriend`, { body: friendInput });
  }

  async addFriend(friendInput) {
    return this.patch(`/api/users/addFriend`, { body: friendInput });
  }

  async deleteFriend(friendInput) {
    return this.patch(`/api/users/deleteFriend`, { body: friendInput });
  }

  async fieldExistence(params) {
    return this.get(`/api/users/fieldExistence`, { params });
  }
}

export default UserAPI;
