import {
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import createQuestBtn from "../../asserts/createQuestBtn.png";

const CreateQuest = () => {
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: 800,
            fontFamily: "Baloo2",
            color: "white",
          }}
        >
          Create Quest
        </Typography>
        <Button>
          <img src={createQuestBtn}></img>
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box
            sx={{
              boxShadow: `
  inset 0 0 30px rgba(225, 225, 225, 0.5),
  inset 0 0 40px rgba(225, 225, 225, 0.3)
`,
              width: "218px",
              height: "218px",
              borderRadius: "40px",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ fontSize: "44px", color: "white", fontFamily: "Baloo2" }}
            >
              +
            </Typography>
            <Typography
              sx={{
                fontSize: "22px",
                color: "white",
                fontSize: "500",
                fontFamily: "Baloo2",
              }}
            >
              Quest Image
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Box
                sx={{
                  boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
                  borderRadius: "15px",
                  height: "56px",
                  width: "202px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 30px",
                }}
              >
                <Box
                  sx={{
                    fontSize: "24px",
                    fontWeight: 500,
                    fontFamily: "Baloo2",
                    color: "white",
                  }}
                >
                  Points :
                </Box>
                <TextField
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      textAlign: "right",
                      fontSize: "16px",
                      padding: 0,
                      width: "60px",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
                  borderRadius: "15px",
                  height: "56px",
                  width: "202px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 30px",
                }}
              >
                <Box
                  sx={{
                    fontSize: "24px",
                    fontWeight: 500,
                    fontFamily: "Baloo2",
                    color: "white",
                  }}
                >
                  Age :
                </Box>
                <TextField
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      textAlign: "right",
                      fontSize: "16px",
                      padding: 0,
                      width: "60px",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
                  borderRadius: "15px",
                  height: "56px",
                  width: "326px",
                }}
              ></Box>
            </Box>
            <Box
              sx={{
                boxShadow: `
            inset 0 0 5px rgba(255, 255, 255, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5)
          `,
                borderRadius: "15px",
                height: "56px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 30px",
              }}
            >
              <Box
                sx={{
                  fontSize: "24px",
                  fontWeight: 500,
                  fontFamily: "Baloo2",
                  color: "white",
                }}
              >
                Category :
              </Box>
              <TextField
                variant="standard"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    textAlign: "right",
                    fontSize: "16px",
                    padding: 0,
                    width: "100%",
                    color: "white",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                boxShadow: `
            inset 0 0 5px rgba(255, 255, 255, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5)
          `,
                borderRadius: "15px",
                height: "56px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 30px",
                marginTop: "20px",
              }}
            >
              <Box
                sx={{
                  fontSize: "24px",
                  fontWeight: 500,
                  fontFamily: "Baloo2",
                  color: "white",
                }}
              >
                Tags :
              </Box>
              <TextField
                variant="standard"
                value={""}
                onChange={(e) => setTags(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    textAlign: "right",
                    fontSize: "16px",
                    padding: 0,
                    width: "60px",
                    color: "white",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
            borderRadius: "15px",
            height: "56px",
            width: "97%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Enter Quest Title"
            InputProps={{
              disableUnderline: true,
              sx: {
                textAlign: "right",
                fontSize: "16px",
                padding: 0,
                width: "100%",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
            borderRadius: "15px",
            height: "200px",
            width: "97%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Enter Quest Title"
            InputProps={{
              disableUnderline: true,
              sx: {
                textAlign: "right",
                fontSize: "16px",
                padding: 0,
                width: "100%",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default CreateQuest;
