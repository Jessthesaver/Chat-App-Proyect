import ManageLeave from "./GroupSettings/ManageLeave";

const MemberGroupOptions = ({ currentChat }) => {
  return (
    <>
      <ManageLeave currentChat={currentChat} />
    </>
  );
};

export default MemberGroupOptions;
