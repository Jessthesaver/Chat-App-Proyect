import { RESTDataSource } from "@apollo/datasource-rest";

class ChatAPI extends RESTDataSource {
  baseURL = process.env.API_CHAT;

  async createMessage(messageInput) {
    return this.post("/api/chat/message/createMessage", { body: messageInput });
  }

  async deleteMessage(_id) {
    return this.delete(`api/chat/message/deleteMessage/${_id}`);
  }

  async getMessagesOfChatRoom(_id) {
    return this.get(`api/chat/message/messagesOfChatRoom/${_id}`);
  }

  async deleteAllChatRoomMessages(_id) {
    return this.delete(`api/chat/message/deleteAllChatRoomMessages/${_id}`);
  }

  async createChatRoom(roomInput) {
    return this.post("/api/chat/rooms/createChatRoom", { body: roomInput });
  }

  async deleteRoom(roomId) {
    return this.delete(`/api/chat/rooms/deleteChatRoom/${roomId}`);
  }

  async getChatRoom(_id) {
    return this.get(`/api/chat/rooms/${_id}`);
  }

  async addMember(_id, member) {
    return this.patch(`/api/chat/rooms/addMember/${_id}`, { body: member });
  }

  async deleteMember(_id, members) {
    return this.patch(`/api/chat/rooms/deleteMember/${_id}`, { body: members });
  }

  async addAdmin(_id, admin) {
    return this.patch(`api/chat/rooms/addAdmin/${_id}`, { body: admin });
  }

  async deleteAdmin(_id, admin) {
    return this.patch(`api/chat/rooms/deleteAdmin/${_id}`, { body: admin });
  }
}

export default ChatAPI;
