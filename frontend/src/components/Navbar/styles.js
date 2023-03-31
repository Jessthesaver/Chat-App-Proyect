export const navbarStyles = {
  drawer: {
    position: "relative",
    // width: '100%',
    width: "20.8vw",
    minWidth: "255px",
    // height: '100vh',
    // height: '100vh',
    flexShrink: 0,
    overflow: "hidden",
    // height: '100%',
    // width: 'calc(100vh - 420px)',
    // width: '100vh',
    // border: '1px solid blue',

    "& .MuiDrawer-paper": {
      width: "20.8vw",
      minWidth: "255px",
      // width: 320,
      overflow: "visible",
      boxSizing: "border-box",
      // border: '1px solid red',
      // backgroundColor: '#101F33',
      // color: 'rgba(255, 255, 255, 0.7)',
    },
  },

  avatar: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "& .MuiGrid-item": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    "& .MuiGrid-grid-xs-7": {
      textAlign: "center",
      wordWrap: "break-word",
    },
    "& .MuiAvatar-root": {
      width: "50px",
      height: "50px",
    },
  },

  tabs: {
    display: "flex",
    flexDirection: "column",
    // width: '316px',
    width: "100%",
    height: "100%",
  },

  icons: {
    marginLeft: "10px",
  },

  text: {
    "& span": {
      marginLeft: "-10px",
      fontWeight: "600",
      fontSize: "20px",
    },
  },

  contacts: {
    width: "100%",
    height: "100%",
    "&  .css-4ogtsq-MuiGrid-root": {
      margin: 0,
      padding: 0,
      width: "100%",
      // height: '100px'
    },
  },

  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    mr: 2,
    width: "calc(20.8vw - 1px)",
    height: "100px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  addUserButton: {
    fontSize: "0.65rem",
    width: "60px",
  },
};
