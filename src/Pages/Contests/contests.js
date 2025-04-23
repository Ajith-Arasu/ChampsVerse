import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import style from "../Contests/style.module.css";
import { useEffect, useState } from "react";
import apiCall from "../API/api";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/loader";
import React, { useRef } from "react";
import Compress from "compress.js";
import { fromBlob, blobToURL } from "image-resize-compress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contests = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const isMobile = useMediaQuery("(max-width:600px)");
  const {
    getContestList,
    createContest,
    getUrlContestImage,
    uploadIMG,
    updateContestStatus,
  } = apiCall();
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tabSwitch, setTabSwitch] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const compress = new Compress();
  const [contestCreation, setContestCreation] = useState(false);
  const [selectedType, setSelectedType] = useState("CONTEST");
  const [TypeSwitch, setTypeSwitch] = useState("false");

  const getContests = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const result = await getContestList(selectedTab, pageKey, selectedType);

        if (result?.page) {
          setPageKey(result?.page);
        } else {
          setPageKey(null);
        }
        setIsLoading(false);
        setData((prev) => [...prev, ...result.data]);
      }
    } finally {
    }
  };

  useEffect(() => {
    if (selectedTab !== "new") {
      getContests();
    }
    setTabSwitch(false);
    setTypeSwitch(false);
  }, [nextPage, tabSwitch, TypeSwitch]);

  const handleClick = (tab) => {
    setSelectedTab(tab);
    setTabSwitch(true);
    setPageKey("");
    setData([]);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (
      scrollTop + windowHeight >= documentHeight - 5 &&
      !isLoading &&
      pageKey !== null
    ) {
      setNextPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCategory = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickToDetail = (contestId, title, categories) => {
    selectedTab === "ongoing" &&
      navigate("/contestdetail", {
        state: {
          contestId,
          title,
          categories,
          selectedType,
        },
      });
  };

  const handleCreation = () => {
    setContestCreation(true);
  };
  const CreateContest = () => {
    const inputRef = useRef(null);
    const dropAreaRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    }, [fileName]); // Add fileName as a dependency

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const [formData, setFormData] = useState({
      type: "",
      work_type: "",
      title: "",
      description: "",
      from: "",
      to: "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updatedFormData = { ...prev, [name]: value };

        return updatedFormData;
      });
    };

    // const handleCategoryChange = (index, field, value) => {
    //   const updatedCategories = [...formData.contest_entry_categories];
    //   updatedCategories[index][field] = value;
    //   setFormData((prev) => ({
    //     ...prev,
    //     contest_entry_categories: updatedCategories,
    //   }));
    // };

    const addCategory = () => {
      setFormData((prev) => ({
        ...prev,
        contest_entry_categories: [
          ...prev.contest_entry_categories,
          { title: "", display: "", score: 0 },
        ],
      }));
    };

    const removeCategory = (index) => {
      setFormData((prev) => ({
        ...prev,
        contest_entry_categories: prev.contest_entry_categories.filter(
          (_, idx) => idx !== index
        ),
      }));
    };

    // const handleSubmit = async () => {
    //   try {
    //     const data = {
    //       ...formData,
    //       from: `${String(formData.from)}T00:00:00.000Z`,
    //       to: `${String(formData.to)}T00:00:00.000Z`,
    //       work_type: formData.work_type.toUpperCase(),
    //       winning_points: parseInt(formData.winning_points, 10),
    //       contest_entry_categories: formData.contest_entry_categories.map(
    //         (category) => ({
    //           ...category,
    //           score: parseInt(category.score, 10) || 0,
    //         })
    //       ),
    //     };

    //     const [name, extension] = fileName.split(".");

    //     const result = await createContest(data);
    //     const imageURl = await getUrlContestImage(
    //       extension,
    //       name,
    //       result.data.contest_id,
    //       `${data.type}S`,
    //       data.type
    //     );

    //     const formats = [
    //       { label: "preSignedUrlThumb", quality: 30, width: 240, height: 320 },
    //       {
    //         label: "preSignedUrlMedium",
    //         quality: 50,
    //         width: 720,
    //         height: 1080,
    //       },
    //       { label: "preSignedUrlRaw", quality: 80, width: 1920, height: 1080 },
    //     ];

    //     const processAndUploadImage = async ({
    //       label,
    //       quality,
    //       width,
    //       height,
    //     }) => {
    //       const fileFormat = file.type.split("/")[1];
    //       const resizedBlob = await fromBlob(
    //         file,
    //         quality,
    //         width,
    //         height,
    //         fileFormat
    //       );

    //       const uploadUrl = imageURl.data[label];
    //       const response = await fetch(uploadUrl, {
    //         method: "PUT",
    //         body: resizedBlob,
    //         headers: {
    //           "Content-Type": resizedBlob.type,
    //         },
    //       });

    //       if (response.ok) {
    //         console.log(`${label} uploaded successfully`);
    //       } else {
    //         throw new Error(
    //           `Failed to upload ${label}: ${response.statusText}`
    //         );
    //       }
    //     };

    //     for (const format of formats) {
    //       await processAndUploadImage(format);
    //     }

    //     console.log("All files uploaded successfully!");
    //   } catch (error) {
    //     console.error("Error during submission:", error);
    //   } finally {
    //     setContestCreation(false);
    //     handleClick("ongoing");
    //   }
    // };

    const handleSubmit = async () => {
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
          };

          // Pick only the required fields
          const allowedFields = [
            "title",
            "description",
            "difficulty_level",
            "winning_points",
            "work_type",
            "type",
          ];
          processedForm = Object.fromEntries(
            Object.entries(processedForm).filter(([key]) =>
              allowedFields.includes(key)
            )
          );
        } else {
          // CONTEST: handle categories
          processedForm = {
            ...processedForm,
          };
        }

        const [name, extension] = fileName.split(".");
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

        const processAndUploadImage = async ({
          label,
          quality,
          width,
          height,
        }) => {
          const fileFormat = file.type.split("/")[1];
          const resizedBlob = await fromBlob(
            file,
            quality,
            width,
            height,
            fileFormat
          );
          const uploadUrl = imageURl.data[label];
          const response = await fetch(uploadUrl, {
            method: "PUT",
            body: resizedBlob,
            headers: {
              "Content-Type": resizedBlob.type,
            },
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
      } catch (error) {
        console.error("Error during submission:", error);
      } finally {
        setContestCreation(false);
        handleClick("ongoing");
      }
    };

    const handleBack = () => {
      handleClick("ongoing");
    };

    return (
      <div>
        <div>
          <Button onClick={() => handleBack()}>Back</Button>
          <Typography
            style={{
              textAlign: "center",
              padding: "20px",
              fontWeight: "bold",
              fontSize: "2rem",
            }}
          >
            Create Contest / Micro Challenge
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={style.uploadIMGcontainer}>
            <div className={style.IMGcard}>
              <h3>Upload Image</h3>
              <div ref={dropAreaRef} className={style.dropBox}>
                <Typography sx={{ padding: "5px" }}>
                  Select Image here
                </Typography>
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept=".jpeg,.png"
                  id="fileID"
                />
                <button className={style.IMGbtn} onClick={handleButtonClick}>
                  Choose File
                </button>
              </div>
            </div>

            <div>
              {/* Type */}
              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Type:
                </Typography>
                <div style={{ display: "flex", gap: "10px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      id="contest"
                      value="CONTEST"
                      name="type"
                      onChange={handleInputChange}
                    />
                    Contest
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      id="micro-challenge"
                      value="MICRO_CONTEST"
                      name="type"
                      onChange={handleInputChange}
                    />
                    Micro Challenge
                  </label>
                </div>
              </div>

              {/* Work Type */}
              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Work Type:
                </Typography>
                <input
                  type="text"
                  name="work_type"
                  value={formData.work_type}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>

              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Difficulty Level:
                </Typography>
                <input
                  type="text"
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>

              {/* Title */}
              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Title:
                </Typography>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>

              {/* Description */}
              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Description:
                </Typography>
                <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    height: "100px",
                    resize: "none",
                    padding: "5px",
                  }}
                />
              </div>

              {/* Date Range */}
              <div
                className={style.formGroup}
                style={{ display: "flex", gap: "20px" }}
              >
                <div>
                  <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                    From:
                  </Typography>
                  <input
                    type="date"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    style={{ padding: "5px" }}
                  />
                </div>
                <div>
                  <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                    To:
                  </Typography>
                  <input
                    type="date"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    style={{ padding: "5px" }}
                  />
                </div>
              </div>

              {/* Winning Points */}
              <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Winning Points:
                </Typography>
                <input
                  type="number"
                  name="winning_points"
                  value={formData.winning_points}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "5px" }}
                  min="0"
                  step="1"
                />
              </div>

              {/* Contest Entry Categories */}
              {/* <div className={style.formGroup}>
                <Typography variant="h5" sx={{ paddingBottom: "10px" }}>
                  Contest Entry Categories:
                </Typography>
                {formData.contest_entry_categories.map((category, index) => (
                  <div
                    key={index}
                    className={style.categoryFields}
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: "1" }}>
                      <Typography sx={{ paddingBottom: "5px" }}>
                        Title:
                      </Typography>
                      <input
                        type="text"
                        value={category.title}
                        onChange={(e) =>
                          handleCategoryChange(index, "title", e.target.value)
                        }
                        style={{ width: "100%", padding: "5px" }}
                      />
                    </div>
                    <div style={{ flex: "1" }}>
                      <Typography sx={{ paddingBottom: "5px" }}>
                        Display:
                      </Typography>
                      <input
                        type="text"
                        value={category.display}
                        onChange={(e) =>
                          handleCategoryChange(index, "display", e.target.value)
                        }
                        style={{ width: "100%", padding: "5px" }}
                      />
                    </div>
                    <div style={{ flex: "1" }}>
                      <Typography sx={{ paddingBottom: "5px" }}>
                        Score:
                      </Typography>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={category.score}
                        onChange={(e) =>
                          handleCategoryChange(index, "score", e.target.value)
                        }
                        style={{ width: "100%", padding: "5px" }}
                      />
                    </div>
                    <div>
                      <Button>Add more categories</Button>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Submit Button */}
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const changeContestType = (event) => {
    setSelectedType(event.target.value);
    setTypeSwitch(true);
    setPageKey("");
    setData([]);
  };

  const statusUpdate = async (contestId) => {
    const res = await updateContestStatus(contestId, selectedType);
    if (res.success) {
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      {!contestCreation && isMobile && (
        <div className={style["right-corner"]} style={{marginTop:'10px'}}>
          <button
            className={
              style["contest-button-mob"]
            }
            onClick={() => handleCreation()}
          >
            Add Contest / Micro Challenge
          </button>
        </div>
      )}
      {!contestCreation && (
        <div className={style[isMobile ? "tab-Section-mob" : "tab-Section"]} style={{marginTop:isMobile &&'10%'}}>
          <div className={style["left-corner"]}>
            <label>
              <input
                type="radio"
                onChange={changeContestType}
                value="CONTEST"
                checked={selectedType === "CONTEST"}
              ></input>
              Contest
            </label>
          </div>
          <div
            className={
              style[
                isMobile ? "section-mob" : "section"
              ]
            }
            onClick={() => handleClick("ongoing")}
          >
            <img
              src={
                selectedTab === "ongoing"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              className={
                selectedTab === "ongoing"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Ongoing
            </Typography>
          </div>
          <div
            className={style[isMobile ? "section-mob" : "section"]}
            onClick={() => handleClick("completed")}
          >
            <img
              src={
                selectedTab === "completed"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              style={{ fontSize: isMobile ? "12px" : "1rem" }}
              className={
                selectedTab === "completed"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Completed
            </Typography>
          </div>
          <div
            className={style[isMobile ? "section-mob" : "section"]}
            onClick={() => handleClick("upcoming")}
          >
            <img
              src={
                selectedTab === "upcoming"
                  ? "/button-normal.png"
                  : "/emptySection.png"
              }
            ></img>
            <Typography
              style={{ fontSize: isMobile ? "12px" : "1rem" }}
              className={
                selectedTab === "upcoming"
                  ? style["center-alligned"]
                  : style["unselected-item"]
              }
            >
              Upcoming
            </Typography>
          </div>

          {!isMobile && (
            <div className={style["right-corner"]}>
              <button
                className={
                  style[isMobile ? "contest-button-mob" : "contest-button"]
                }
                onClick={() => handleCreation()}
              >
                Add Contest / Micro Challenge
              </button>
            </div>
          )}
        </div>
      )}

     
      {contestCreation && <CreateContest />}
      {selectedTab !== "new" && (
        <div className={style[isMobile? "grid-container-mob":"grid-container"]} style={{marginTop: isMobile &&'20px'}}>
          {data.map((item) => {
            {
              console.log(
                "image",
                `https://dcp5pbxslacdh.cloudfront.net/${selectedType}S/${item.contest_id}/IMAGES/medium/${item.ct_banner}`
              );
            }

            return (
              <div
                className={style[isMobile? "grid-item-mob":"grid-item"]}
                onClick={() =>
                  handleClickToDetail(
                    item.contest_id,
                    item.title,
                    item.contest_entry_categories
                  )
                }
              >
                <div className={style["image"]}>
                  <img
                    src={`https://dcp5pbxslacdh.cloudfront.net/${selectedType}S/${item.contest_id}/IMAGES/medium/${item.ct_banner}`}
                  ></img>
                </div>
                <div className={style["content"]}>
                  <Typography
                    sx={{
                      fontSize: isMobile? '24px':"1.5rem",
                      fontWeight: 600,
                      lineHeight: "1.2",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile? '18px':"1rem", padding: "16px" }}>
                    Due:2 days left
                  </Typography>

                  {selectedTab === "upcoming" && (
                    <Button
                      style={{ color: "white", backgroundColor: "#007bff" }}
                      onClick={() => statusUpdate(item.contest_id)}
                    >
                      Move to Ongoing
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Contests;
