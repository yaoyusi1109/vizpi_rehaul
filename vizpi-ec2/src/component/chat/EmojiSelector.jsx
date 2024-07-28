import React from "react";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/material";


const EmojiSelector = ({onClick,user}) => {

    const handleSelect = async (choice) => {
        //console.log("Selected Emoji: "+choice)
        onClick(choice,user)
    }

    return (
    <Box>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={()=>handleSelect("❤️")}>❤️</IconButton>
        <IconButton onClick={()=>handleSelect("✅")}>✅</IconButton>
        <IconButton onClick={()=>handleSelect("👍")}>👍</IconButton>
        <IconButton onClick={()=>handleSelect("❔")}>❔</IconButton>
      </Stack>
    </Box>
  );
};

export default EmojiSelector;
