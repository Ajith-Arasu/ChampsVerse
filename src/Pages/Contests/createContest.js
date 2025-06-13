import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fromBlob, blobToURL } from "image-resize-compress";
import ApiCall from "../API/api";
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
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const CreateContest = () => {
  const inputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createContest, getUrlContestImage, getSponsorList, updateQuest } =
    ApiCall();
  const [selectedFile, setSelectedFile] = useState(null);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState("");
  const [data, setData] = useState([]);
  const location = useLocation();
  const { item } = location.state || {};
  const [changedFields, setChangedFields] = useState([]);
  const [tags, setTags] = useState([""]);
  const [sponsorOptions, setSponsorOptions] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  let createContestresult;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTagChange = (index, event) => {
    const newTags = [...tags];
    newTags[index] = event.target.value;
    setTags(newTags);
  };

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

  useEffect(() => {
    const handleFileChange = (e) => {
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
    difficulty_level: "",
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
        difficulty_level:
          item.difficulty_level !== undefined
            ? Number(item.difficulty_level)
            : "",
        category: item.category || "",
        tags: item.tags || "",
        winning_points: item.winning_points || "",
        ref_link: item.ref_link || "",
      });
    }
  }, [item]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("allSponsors", formData.sponsors);
    const getSponsorAvatar = (code) => {
      const sponsor = allSponsors.find((s) => s.sponsor_code === code);
      return sponsor && sponsor.sponsor_avatar;
    };
    const avatar = getSponsorAvatar(formData.sponsors);

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
          tags: tags.map((tag) => ({ name: tag })),
          sponsors: [
            {
              code: formData.sponsors,
              avatar,
            },
          ],
          winning_points: formData.winning_points
            ? parseInt(formData.winning_points, 10)
            : "",
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
          "ref_link",
        ];
        processedForm = Object.fromEntries(
          Object.entries(processedForm).filter(([key]) =>
            allowedFields.includes(key)
          )
        );
      }

      if (item) {
        const updatedFields = Object.fromEntries(
          Object.entries(processedForm).filter(([key, value]) => {
            const oldValue = item[key];

            const isEmpty =
              value === "" ||
              value === null ||
              (Array.isArray(value) && value.length === 0) ||
              (key === "tags" &&
                Array.isArray(value) &&
                value.every((tag) => !tag.name?.trim())) ||
              (key === "sponsors" &&
                Array.isArray(value) &&
                value.every((s) => !s.code?.trim()));

            if (isEmpty) return false;

            if (Array.isArray(value) && Array.isArray(oldValue)) {
              return JSON.stringify(value) !== JSON.stringify(oldValue);
            }
            return value !== oldValue;
          })
        );

        if (Object.keys(updatedFields).length > 0) {
          const result = await updateQuest(item.contest_id, updatedFields);
          console.log("Updated fields:", result);
        } else {
          console.log("No changes detected");
        }
        setFormData({});
      } else {
        const cleanedForm = Object.fromEntries(
          Object.entries(processedForm).filter(([key, value]) => {
            if (value === "" || value === null || value === undefined)
              return false;

            if (Array.isArray(value)) {
              if (key === "tags") {
                return value.some((tag) => tag.name?.trim());
              }
              if (key === "sponsors") {
                return value.some((sponsor) => sponsor.code?.trim());
              }
              return value.length > 0;
            }

            return true;
          })
        );
        createContestresult = await createContest(cleanedForm);
      }

      if (selectedFile) {
        const [name, extension] = selectedFile.name.split(".");
        const imageURl = await getUrlContestImage(
          extension,
          name,
          item ? item.contest_id : createContestresult.data.contest_id,
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

        const processAndUploadImage = async ({
          label,
          quality,
          width,
          height,
        }) => {
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
      }
      console.log("All files uploaded successfully!");
      setFormData([]);
    } catch (error) {
    } finally {
    }
  };

  const handleChange = (e) => {
    if (item && !changedFields.includes(e.target.name)) {
      setChangedFields((prev) => [...prev, e.target.name]);
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contestType = [
    { label: "Contest", value: "CONTEST" },
    { label: "Quest", value: "MICRO_CONTEST" },
  ];

  const workTypeOptions = [{ label: "Post", value: "POST" }];

  const difficultyLevelOptions = [
    { label: "Easy", value: 1 },
    { label: "Moderate", value: 2 },
    { label: "Advanced", value: 3 },
    { label: "Expert", value: 4 },
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
            disabled={item}
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
            placeholder="Enter Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "50%", marginTop: "4px" }}
          />
        </Box>

        {/* Description */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            minHeight: "170px",
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
            placeholder="Enter Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            placeholder="choose"
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
          <FormControl style={{ width: "50%", marginTop: "4px" }} size="small">
            <Select
              displayEmpty
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleChange}
              required
              style={{ width: "50%", marginTop: "4px" }}
              disabled={item}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <span style={{ color: grey[500] }}>
                      Choose difficulty_level
                    </span>
                  );
                }
                const selectedOption = sponsorOptions.find(
                  (opt) => opt.value === selected
                );
                return selectedOption?.label ?? selected;
              }}
            >
              {difficultyLevelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            placeholder="Enter winning_points"
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
            placeholder="Enter Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: "50%", marginTop: "4px" }}
          />
        </Box>

        {/* Tags */}
        <Box
          style={{
            width: "75%",
            borderRadius: "12px",
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid rgb(218, 220, 224)",
            padding: "10px",
          }}
        >
          <Typography style={{ marginLeft: "5px" }}>Tags</Typography>
          <Box>
            {(formData.tags || tags).map((tag, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  placeholder="Enter tag"
                  name={`tag-${index}`}
                  value={tag?.name || tag || ""}
                  onChange={(e) => handleTagChange(index, e)}
                  sx={{ width: "50%", marginTop: "4px" }}
                  InputProps={{
                    endAdornment:
                      index > 0 &&
                      index === tags.length - 1 &&
                      tags.length <= 5 ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleRemove(index)}
                            edge="end"
                          >
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
            name="sponsors"
            value={formData.sponsors}
            onChange={handleChange}
            style={{ width: "50%", marginTop: "4px" }}
          >
            {/* Placeholder item (will show when value is empty) */}
            <MenuItem value="" disabled>
              Choose sponsor
            </MenuItem>

            {/* Loading state */}
            {sponsorOptions.length === 0 ? (
              <MenuItem disabled>Loading sponsors…</MenuItem>
            ) : (
              sponsorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            )}
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
            disabled={!!selectedFile}
          >
            {item ? "Reupload File" : "Upload File"}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {selectedFile && <Typography>File: {selectedFile.name}</Typography>}
        </Box>

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
          <Typography style={{ marginLeft: "5px" }}>Ref Link</Typography>
          <TextField
            placeholder="enter link"
            name="link"
            value={formData.ref_link}
            onChange={handleChange}
            style={{ width: "50%", marginTop: "4px" }}
          />
        </Box>

        {/* Submit Button */}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "25%" }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default CreateContest;
