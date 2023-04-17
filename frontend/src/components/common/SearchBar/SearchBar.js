import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, InputBase } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  gap: "0px",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(90, 150, 90, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(90, 150, 90, 0.3)",
  },
  margin: "0 3px",
  width: "85%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",

  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <div>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder}
          onChange={onChange}
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
    </div>
  );
};

export default SearchBar;
