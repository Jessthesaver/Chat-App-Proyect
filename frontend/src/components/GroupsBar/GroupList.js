import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GroupMenu from "./GroupMenu";

const GroupList = ({ rooms }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  return (
    <List spacing={2}>
      {rooms.map((item) => {
        const { _id, name, groupalChat } = item;

        return (
          <ListItem
            button
            key={_id}
            sx={{
              padding: "0 0 0 5px",
              justifyContent: "center",
              justifyItems: "center",
              width: "98%",
              wordBreak: "break-word",
            }}
            onClick={(event) => {
              if (
                typeof event.target.className === "string" &&
                event.target.className.includes(
                  "MuiTypography-root MuiTypography-body1 MuiListItemText-primary"
                )
              ) {
                dispatch({
                  type: "setConversation",
                  payload: {
                    _id,
                  },
                });

                navigate(`conversation/${_id}`);
              }
            }}>
            <Grid container>
              <Grid item xs={10}>
                <ListItemText>{name}</ListItemText>
              </Grid>
              <Grid item xs={2}>
                {groupalChat ? <GroupMenu id={_id} /> : null}
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
};

export default GroupList;
