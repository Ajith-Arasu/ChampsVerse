import {
  Typography,
  Box,
  TextField,
  InputBase,
  InputAdornment,
  Button,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "../../asserts/close.png";
import { useRef, useState, useEffect } from "react";
import dropdown from "../../asserts/dropDown.png";
import createQuestBtn from "../../asserts/createQuestBtn.png";
import bottomSheetBG from "../../asserts/BottomSheetBG.png";
import mobCreateQuestBtn from "../../asserts/createQuestBtn.png";
import ApiCall from "../API/api";
import { fromBlob, blobToURL } from "image-resize-compress";

const CreateQuest = () => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [level, setLevel] = useState("");
  const fileInputRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [preview, setPreview] = useState(null);
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [sponsorOptions, setSponsorOptions] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { createContest, getUrlContestImage, getSponsorList, updateQuest } =
    ApiCall();
  const [formData, setFormData] = useState({
    winning_points: "",
    h_age: "",
    category: "",
    title: "",
    description: "",
    ref_link: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    const data = {
      ...formData,
      winning_points:
        formData.winning_points && parseInt(formData.winning_points, 10),
      difficulty_level: level && parseInt(level, 10),
      h_age: formData.h_age && parseInt(formData.h_age, 10),
      tags: tags.map((tag) => ({ name: tag })),
      sponsors: selectedSponsors,
      type: "MICRO_CONTEST",
      work_type: "POST",
      l_age: 0,
    };
    const createContestresult = await createContest(data);
    
    const lastDotIndex = selectedFile.name.lastIndexOf(".");

    const name = selectedFile.name.substring(0, lastDotIndex);
    const extension = selectedFile.name.substring(lastDotIndex + 1);

    const imageURl = await getUrlContestImage(
      extension,
      name,
      createContestresult.data.contest_id,
      `MICRO_CONTESTS`,
      "MICRO_CONTEST"
    );

    const formats = [
      { label: "preSignedUrlThumb", quality: 30, width: 240, height: 320 },
      {
        label: "preSignedUrlMedium",
        quality: 50,
        width: 720,
        height: 1080,
      },
      { label: "preSignedUrlRaw", quality: 80, width: 1920, height: 1080 },
    ];

    const processAndUploadImage = async ({ label, quality, width, height }) => {
      const fileFormat = selectedFile.type.split("/")[1];
      const resizedBlob = await fromBlob(
        selectedFile,
        quality,
        width,
        height,
        extension
      );
      const uploadUrl = imageURl.data[label];
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: resizedBlob,
        headers: { "Content-Type": resizedBlob.type },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${label}: ${response.statusText}`);
      }
    };

    for (const format of formats) {
      await processAndUploadImage(format);
    }
    window.location.reload();
     setFormData([]);
  };

  const handleDelete = (indexToDelete) => {
    setTags((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleChangeSponsor = (event) => {
    const selectedCodes = event.target.value;

    setSelectedSponsors(selectedCodes);

    const sponsors = allSponsors
      .filter((sponsor) => selectedCodes.includes(sponsor.sponsor_code))
      .map((sponsor) => ({
        code: sponsor.sponsor_code,
        avatar: sponsor.sponsor_avatar,
      }));

    setSelectedSponsors(sponsors);
  };

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await getSponsorList("");

        const item = data.data.map((item) => ({
          label: item.sponsor_code,
          value: item.sponsor_code,
        }));
        setSponsorOptions(item);
        setAllSponsors(data.data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
  }, []);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (tags.length < 5) {
        setTags((prev) => [...prev, inputValue.trim()]);
        setInputValue("");
      }
    }
  };
  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  const sponsorsList = ["Apple", "Google", "Amazon", "Meta", "Microsoft"];
  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: isMobile && "100%", margin: isMobile && "10% 5%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: isMobile ? "19px" : "32px",
            fontFamily: "Baloo2",
            color: "white",
          }}
        >
          Create Quest
        </Typography>
        {!isMobile && (
          <Button type="submit">
            <img
              src={createQuestBtn}
              style={{ width: "220px", height: "90px" }}
            ></img>
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          margin: "0 0",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: isMobile ? "3px" : "10px" }}>
          <Box
            onClick={handleBoxClick}
            sx={{
              boxShadow: `
            inset 0 0 5px rgba(255, 255, 255, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.5)
          `,

              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              height: isMobile ? "105px" : "240px",
              width: isMobile ? "105px" : "240px",
              flexShrink: 0, // Prevents shrinking
              flexGrow: 0, // Prevents growing
              flexBasis: isMobile ? "105px" : "240px",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Quest Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography sx={{ fontSize: isMobile && "8px" }}>
                {"+ Quest Image"}
              </Typography>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "8px" : "10px",
              mt: isMobile && "4%",
            }}
          >
            <Box sx={{ display: "flex", gap: isMobile ? "3px" : "10px" }}>
              <Box
                sx={{
                  boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
                  height: isMobile ? "38px" : "72px",
                  width: isMobile ? "95px" : "202px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  name="winning_points"
                  value={formData.winning_points}
                  onChange={handleInputChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: isMobile ? "12px" : "18px",
                            minWidth: "80px",
                            textAlign: "center",
                          }}
                        >
                          Points :
                        </Box>
                      </InputAdornment>
                    ),
                    style: {
                      color: "white",
                      fontSize: isMobile ? "12px" : "18px",
                      textAlign: "center",
                    },
                  }}
                  sx={{
                    input: {
                      textAlign: "center",
                      color: "white",
                    },
                    width: "150px",
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
                  height: isMobile ? "38px" : "72px",
                  width: isMobile ? "95px" : "202px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  name="h_age"
                  value={formData.h_age}
                  onChange={handleInputChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: isMobile ? "12px" : "18px",
                            minWidth: "80px",
                            textAlign: "center",
                          }}
                        >
                          Age :
                        </Box>
                      </InputAdornment>
                    ),
                    style: {
                      color: "white",
                      fontSize: "18px",
                      textAlign: "center",
                    },
                  }}
                  sx={{
                    input: {
                      textAlign: "center",
                      color: "white",
                    },
                    width: "150px",
                  }}
                />
              </Box>

              {!isMobile && (
                <Box
                  sx={{
                    boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
                    height: "72px",
                    width: "252px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: level && "center",
                  }}
                >
                  <TextField
                    select
                    variant="standard"
                    value={level}
                    onChange={handleChange}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: !level ? (
                        <InputAdornment position="center">
                          <Box
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                              minWidth: "80px",
                              ml: "10%",
                              mr: "30px",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              textAlign: level && "center",
                            }}
                          >
                            Choose Difficulty Level
                          </Box>
                        </InputAdornment>
                      ) : null,
                      style: {
                        color: "white",
                        fontSize: "18px",
                        textAlign: level && "center",
                      },
                    }}
                    SelectProps={{
                      IconComponent: () => (
                        <img
                          src={dropdown}
                          alt="dropdown"
                          style={{
                            width: "16px",
                            height: "16px",
                            position: "absolute",
                            right: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        />
                      ),
                      native: false,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            backgroundColor: "#222",
                            color: "white",
                          },
                        },
                      },
                    }}
                    sx={{
                      select: {
                        color: "white",
                        textAlign: "center",
                      },
                      width: "100%",
                    }}
                  >
                    <MenuItem value="1">Easy</MenuItem>
                    <MenuItem value="2">Moderate</MenuItem>
                    <MenuItem value="3">Hard</MenuItem>
                    <MenuItem value="4">Advanced</MenuItem>
                  </TextField>
                </Box>
              )}
            </Box>
            {isMobile && (
              <Box
                sx={{
                  boxShadow: `
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 15px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
                  height: isMobile ? "38px" : "72px",
                  width: isMobile ? "97%" : "202px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  select
                  variant="standard"
                  value={level}
                  onChange={handleChange}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: !level ? (
                      <InputAdornment position="center">
                        <Box
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: isMobile ? "12px" : "16px",
                            minWidth: "80px",
                            ml: "10%",
                            mr: "30px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          Choose Difficulty Level
                        </Box>
                      </InputAdornment>
                    ) : null,
                    style: {
                      color: "white",
                      fontSize: isMobile ? "10px" : "18px",
                      textAlign: level && "center",
                    },
                  }}
                  SelectProps={{
                    IconComponent: () => (
                      <img
                        src={dropdown}
                        alt="dropdown"
                        style={{
                          width: "16px",
                          height: "16px",
                          position: "absolute",
                          right: "20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                    ),
                    native: false,
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#222",
                          color: "white",
                        },
                      },
                    },
                  }}
                  sx={{
                    select: {
                      color: "white",
                      textAlign: "center",
                    },
                    width: "100%",
                  }}
                >
                  <MenuItem value="1">Easy</MenuItem>
                  <MenuItem value="2">Moderate</MenuItem>
                  <MenuItem value="3">Hard</MenuItem>
                  <MenuItem value="4">Advanced</MenuItem>
                </TextField>
              </Box>
            )}
            {!isMobile && (
              <Box
                sx={{
                  boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
                  height: isMobile ? "38px" : "72px",
                  width: "100%",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  color: "white",
                }}
              >
                <TextField
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                            minWidth: "100%",
                          }}
                        >
                          Category :
                        </Box>
                      </InputAdornment>
                    ),
                    style: {
                      color: "white",
                      fontSize: "18px",
                    },
                  }}
                  sx={{
                    input: {
                      color: "white",
                    },
                    width: "100%",
                  }}
                />
              </Box>
            )}
            {!isMobile && (
              <Box
                sx={{
                  boxShadow: `
                     inset 0 0 5px rgba(255, 255, 255, 0.2),
                     inset 0 0 10px rgba(255, 255, 255, 0.3),
                     inset 0 0 15px rgba(255, 255, 255, 0.4),
                     inset 0 0 20px rgba(255, 255, 255, 0.5)
                   `,
                  height: isMobile ? "38px" : "72px",
                  width: "100%",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  color: "white",
                  overflowX: "auto",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    minWidth: "80px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Tags :
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {tags.map((tag, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "16px",
                        px: 1.2, // Reduced horizontal padding
                        py: "4px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "16px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        maxHeight: "28px",
                      }}
                    >
                      {tag}
                      <Button
                        size="small"
                        onClick={() => handleDelete(index)}
                        sx={{
                          minWidth: 0,
                          ml: 0.5,
                          p: 0,
                          color: "white",
                          "&:hover": { background: "transparent" },
                        }}
                      >
                        <img
                          src={CloseIcon}
                          alt="close"
                          style={{
                            width: "10px",
                            height: "10px",
                            marginLeft: "4px",
                          }}
                        />
                      </Button>
                    </Box>
                  ))}

                  {/* Add Tag Input (hidden if 5 tags already) */}
                  {tags.length < 5 && (
                    <TextField
                      variant="standard"
                      placeholder="Add Tag"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleAddTag}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          color: "white",
                          fontSize: "14px",
                          padding: "4px 8px",
                        },
                      }}
                      sx={{
                        width: "100px",
                        input: {
                          color: "white",
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        {isMobile && (
          <Box
            sx={{
              boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
              height: isMobile ? "38px" : "72px",
              width: isMobile ? "115%" : "100%",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "20px",
              color: "white",
            }}
          >
            <TextField
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: isMobile ? "12px" : "18px",
                        minWidth: "100%",
                      }}
                    >
                      Category :
                    </Box>
                  </InputAdornment>
                ),
                style: {
                  color: "white",
                  fontSize: "18px",
                },
              }}
              sx={{
                input: {
                  color: "white",
                },
                width: "100%",
              }}
            />
          </Box>
        )}
        {isMobile && (
          <Box
            sx={{
              boxShadow: `
                     inset 0 0 5px rgba(255, 255, 255, 0.2),
                     inset 0 0 10px rgba(255, 255, 255, 0.3),
                     inset 0 0 15px rgba(255, 255, 255, 0.4),
                     inset 0 0 20px rgba(255, 255, 255, 0.5)
                   `,
              height: isMobile ? "38px" : "72px",
              width: isMobile ? "115%" : "100%",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "20px",
              color: "white",
              overflowX: "auto",
              gap: 1,
            }}
          >
            <Box
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "18px",
                minWidth: "80px",
                whiteSpace: "nowrap",
              }}
            >
              Tags :
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: 1,
                alignItems: "center",
              }}
            >
              {tags.map((tag, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    px: 1.2, // Reduced horizontal padding
                    py: "4px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    maxHeight: "28px",
                  }}
                >
                  {tag}
                  <Button
                    size="small"
                    onClick={() => handleDelete(index)}
                    sx={{
                      minWidth: 0,
                      ml: 0.5,
                      p: 0,
                      color: "white",
                      "&:hover": { background: "transparent" },
                    }}
                  >
                    <img
                      src={CloseIcon}
                      alt="close"
                      style={{
                        width: "10px",
                        height: "10px",
                        marginLeft: "4px",
                      }}
                    />
                  </Button>
                </Box>
              ))}

              {/* Add Tag Input (hidden if 5 tags already) */}
              {tags.length < 5 && (
                <TextField
                  variant="standard"
                  placeholder="Add Tag"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleAddTag}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: "white",
                      fontSize: "14px",
                      padding: "4px 8px",
                    },
                  }}
                  sx={{
                    width: "100px",
                    input: {
                      color: "white",
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        )}
        <Box
          sx={{
            boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
            height: isMobile ? "38px" : "72px",
            width: isMobile ? "115%" : "91%",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "white",
          }}
        >
          <TextField
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: isMobile ? "12px" : "18px",
                      minWidth: "80x",
                    }}
                  >
                    Quest Title :
                  </Box>
                </InputAdornment>
              ),
              style: {
                color: "white",
                fontSize: "18px",
              },
            }}
            sx={{
              input: {
                color: "white",
              },
              width: "100%",
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
            height: "auto",
            width: isMobile ? "115%" : "91%",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column", // So label appears above
            alignItems: "flex-start",
            padding: "10px 20px", // Add top padding to prevent overlap
            color: "white",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? "12px" : "18px",
              marginBottom: "4px",
            }}
          >
            Quest Description :
          </Typography>

          <TextField
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            variant="standard"
            multiline
            minRows={3}
            InputProps={{
              disableUnderline: true,
              style: {
                color: "white",
                fontSize: "18px",
              },
            }}
            sx={{
              textarea: {
                color: "white",
                paddingTop: "4px",
              },
              width: "100%",
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
            height: isMobile ? "38px" : "72px",
            width: isMobile ? "115%" : "91%",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "white",
          }}
        >
          <Select
            multiple
            value={selectedSponsors}
            onChange={handleChangeSponsor}
            renderValue={(selected) =>
              selected.length === 0 ? "Select sponsors" : selected.join(", ")
            }
          >
            {allSponsors.map((sponsor) => (
              <MenuItem key={sponsor.sponsor_code} value={sponsor.sponsor_code}>
                {sponsor.sponsor_code}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          sx={{
            boxShadow: `
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.3),
          inset 0 0 15px rgba(255, 255, 255, 0.4),
          inset 0 0 20px rgba(255, 255, 255, 0.5)
        `,
            height: isMobile ? "38px" : "72px",
            width: isMobile ? "115%" : "91%",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            padding: "20px",
            color: "white",
          }}
        >
          <TextField
            name="ref_link"
            value={formData.ref_link}
            onChange={handleInputChange}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: isMobile ? "12px" : "18px",
                      minWidth: "80x",
                    }}
                  >
                    Supporting url:
                  </Box>
                </InputAdornment>
              ),
              style: {
                color: "white",
                fontSize: "18px",
              },
            }}
            sx={{
              input: {
                color: "white",
              },
              width: "100%",
            }}
          />
        </Box>
      </Box>
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "80px",
            backgroundImage: `url(${bottomSheetBG})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "Baloo2",
            fontSize: "18px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
              bottom: "10px",
              left: 0,
            }}
          >
            <Button type="submit">
              <img src={mobCreateQuestBtn} style={{ width: "150px" }} />
            </Button>
          </Box>
        </Box>
      )}
    </form>
  );
};
export default CreateQuest;
