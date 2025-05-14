import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fromBlob, blobToURL } from "image-resize-compress";
import apiCall from "../API/api";
import Loader from "../Loader/loader";
import style from "../Contests/style.module.css";
import closeIcon from "../../asserts/close.png";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  InputAdornment,
  IconButton
} from "@mui/material";

const CreateContest = () => {
  const inputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createContest, getUrlContestImage, getSponsorList, updateQuest } =
    apiCall();
  const [selectedFile, setSelectedFile] = useState(null);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const location = useLocation();
  const { item } = location.state || {};
  const [changedFields, setChangedFields] = useState([]);
  const [tags, setTags] = useState([""]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  console.log("quest", item);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTagChange = (index, event) => {
    const newTags = [...tags];
    newTags[index] = event.target.value;
    setTags(newTags);
  };

  console.log("tags", tags);

  const handleAdd = () => {
    if (tags.length < 5) {
      setTags([...tags, ""]);
    }
  };
  const handleRemove = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await getSponsorList(pageKey);
        console.log(data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
    console.log('useeffect called');
  }, []);


  useEffect(() => {
    const handleFileChange = (e) => {
      console.log("handleFileChange called");
      if (e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        setFileName(selectedFile.name);
        setFile(selectedFile);
        if (dropAreaRef.current) {
          dropAreaRef.current.innerHTML = `
            <div class="${style.form}">
              <h4>Selected File: ${selectedFile.name}</h4>
              <button class="${style.btn}" disabled>File Uploaded</button>
            </div>
          `;
        }
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("change", handleFileChange);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("change", handleFileChange);
      }
    };
  }, [fileName]);

  const [formData, setFormData] = useState({
    type: "",
    work_type: "",
    title: "",
    description: "",
    from: "",
    to: "",
    sponsors: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || "",
        work_type: item.work_type || "",
        title: item.title || "",
        description: item.description || "",
        from: item.from?.split("T")[0] || "",
        to: item.to?.split("T")[0] || "",
        sponsors: item.sponsors?.[0]?.code || "",
        difficulty_level: item.difficulty_level || "",
        category: item.category || "",
        tags: item.tags?.map((t) => t.name).join(", ") || "",
        winning_points: item.winning_points || "",
      });
    }
  }, [item]);


  const handleSubmit = async (event) => {
    console.log("changedFields", changedFields);
    event.preventDefault();
    try {
      let processedForm = {
        ...formData,
        from: `${String(formData.from)}T00:00:00.000Z`,
        to: `${String(formData.to)}T00:00:00.000Z`,
        work_type: formData.work_type.toUpperCase(),
      };

      if (formData.type === "MICRO_CONTEST") {
        processedForm = {
          ...processedForm,
          difficulty_level: parseInt(formData.difficulty_level, 10),
          category: formData.category,
          tags: Array.isArray(tags)
            ? formData.tags.map((tag) => ({ name: tag }))
            : String(formData.tags)
              .split(",")
              .map((tag) => ({ name: tag.trim() })),
          sponsors: [{ code: formData.sponsors, avatar: "SponsorAvatar1.png" }],
          winning_points: parseInt(formData.winning_points, 10),
        };

        const allowedFields = [
          "title",
          "description",
          "difficulty_level",
          "winning_points",
          "work_type",
          "type",
          "category",
          "tags",
          "sponsors",
        ];
        processedForm = Object.fromEntries(
          Object.entries(processedForm).filter(([key]) =>
            allowedFields.includes(key)
          )
        );
      }

      console.log("processedForm", processedForm);
      console.log("item", item);


      if (item) {
        console.log("item", item);
        const result = await updateQuest(item.contest_id, processedForm);
      } else {
        const [name, extension] = selectedFile.name.split(".");
        const result = await createContest(processedForm);
        const imageURl = await getUrlContestImage(
          extension,
          name,
          result.data.contest_id,
          `${processedForm.type}S`,
          processedForm.type
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

        console.log("selectedFile", selectedFile);
        console.log("File", file);
        const processAndUploadImage = async ({
          label,
          quality,
          width,
          height,
        }) => {
          console.log("processAndUploadImage called");
          const fileFormat = selectedFile.type.split("/")[1];

          const resizedBlob = await fromBlob(
            selectedFile,
            quality,
            width,
            height,
            fileFormat
          );
          const uploadUrl = imageURl.data[label];
          const response = await fetch(uploadUrl, {
            method: "PUT",
            body: resizedBlob,
            headers: { "Content-Type": resizedBlob.type },
          });

          if (!response.ok) {
            throw new Error(
              `Failed to upload ${label}: ${response.statusText}`
            );
          }
        };

        for (const format of formats) {
          await processAndUploadImage(format);
        }

        console.log("All files uploaded successfully!");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
    }
  };

  const handleChange = (e) => {
    if (item) {
      setChangedFields((prev) => [...prev, ...e.target.name]);
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const sponsorOptions = [
    { label: "Sponsor A", value: "sponsorA" },
    { label: "Sponsor B", value: "sponsorB" },
    { label: "Sponsor C", value: "sponsorC" },
  ];

  const contestType = [
    { label: "Contest", value: "CONTEST" },
    { label: "Quest", value: "MICRO_CONTEST" },
  ];

  const workTypeOptions = [{ label: "Post", value: "POST" }];

  const difficultyLevelOptions = [
    { label: "Easy", value: "1" },
    { label: "Moderate", value: "2" },
    { label: "Advanced", value: "3" },
    { label: "Expert", value: "4" },
  ];

  const avatarOptions = [
    { label: "Avatar 1", value: "avatar1" },
    { label: "Avatar 2", value: "avatar2" },
    { label: "Avatar 3", value: "avatar3" },
  ];

  return (
    <div style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <Box style={{ height: "20px" }}></Box>
      <Box
        style={{
          margin: "0 20%",
          width: "60%",
          borderRadius: "12px",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(255, 166, 101)",
          border: "1px solid rgb(218, 220, 224)",
          padding: "10px",
        }}
      >
        <Typography
          style={{
            textAlign: "center",
            padding: "20px",
            fontWeight: "bold",
            fontSize: "2rem",
            color: "white",
          }}
        >
          Create Contest / Quest
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          margin: "10px 20%",
          gap: "20px",
        }}
      >
        {/* Contest Type */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "8px" }}>Contest Type</Typography>
          <TextField
            select
            placeholder="Choose"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px", marginLeft: "10px" }}
          >
            {contestType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Title */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Enter Title</Typography>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
            InputLabelProps={{ shrink: false }}
          />
        </Box>

        {/* Description */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "125px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>
            Enter Description
          </Typography>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            minRows={3}
            style={{ width: "80%", marginTop: "4px" }}
          />
        </Box>

        {/* Work Type */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Work Type</Typography>
          <TextField
            select
            label="choose"
            name="work_type"
            value={formData.work_type}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          >
            {workTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Difficulty Level */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>
            Difficulty Level
          </Typography>
          <TextField
            select
            label="Choose"
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          >
            {difficultyLevelOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Winning Points */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Winning Points</Typography>
          <TextField
            label="enter"
            name="winning_points"
            value={formData.winning_points}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          />
        </Box>

        {/* Category */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Category</Typography>
          <TextField
            label="enter"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          />
        </Box>

        {/* Tags */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            minHeight: "100px", // Ensures a minimum height
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Tags</Typography>
          <Box>
            {tags.map((tag, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, mb: 2 }}
              >
                <TextField
                  label="Enter"
                  name={`tag-${index}`}
                  value={tag}
                  onChange={(e) => handleTagChange(index, e)}
                  sx={{ width: "50%", marginTop: "4px" }}
                  InputProps={{
                    endAdornment:
                      index > 0 && index === tags.length - 1 && tags.length <= 5 ? (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleRemove(index)} edge="end">
                            <img
                              src={closeIcon}
                              alt="close"
                              width="16"
                              height="16"
                            />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                  }}
                />
                {index === tags.length - 1 && tags.length < 5 && (
                  <Button variant="contained" onClick={handleAdd}>
                    Add
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sponsor */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Sponsor</Typography>
          <TextField
            select
            label="choose"
            name="sponsors"
            value={formData.sponsors}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          >
            {sponsorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* File Upload */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Upload Image</Typography>
          <Button
            variant="contained"
            component="label"
            style={{ width: "35%", marginTop: "4px" }}
            disabled={!!selectedFile || item}
          >
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {selectedFile && <Typography>File: {selectedFile.name}</Typography>}
        </Box>

        {/* Submit Button */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ width: "25%" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default CreateContest;
