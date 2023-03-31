import ManageAdmins from "./GroupSettings/ManageAdmins";
import ManageDeleteGroup from "./GroupSettings/ManageDeleteGroup";
import ManageLeave from "./GroupSettings/ManageLeave";
import ManageMembers from "./GroupSettings/ManageMembers";

const AdminGroupOptions = ({ currentChat }) => {
  return (
    <>
      <ManageMembers currentChat={currentChat} />
      <ManageAdmins currentChat={currentChat} />
      <ManageLeave currentChat={currentChat} />
      <ManageDeleteGroup currentChat={currentChat} />
    </>
  );
};

export default AdminGroupOptions;
