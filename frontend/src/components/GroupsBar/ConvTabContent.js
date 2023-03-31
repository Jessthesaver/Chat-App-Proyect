import { useDispatch, useSelector } from "react-redux";
import GroupList from "./GroupList";

const ConvTabContent = ({ rooms }) => {
  const { rooms: allUserRooms, username } = useSelector(
    (state) => state.user.value
  );

  if (rooms.length === 0) {
    return <GroupList rooms={allUserRooms} />;
  } else {
    return <GroupList rooms={rooms} />;
  }
};

export default ConvTabContent;
