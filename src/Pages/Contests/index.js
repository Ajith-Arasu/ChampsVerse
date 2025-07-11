import { Typography, Box, Button, useMediaQuery } from "@mui/material";
import buttonBG from "../../asserts/tabSwitch.png";
import { useEffect, useState } from "react";
import ApiCall from "../API/api";
import ViewWorksBtn from "../../asserts/viewWorks.png";

const Contest = () => {
  const {
    getContestList,
    createContest,
    getUrlContestImage,
    uploadIMG,
    updateContestStatus,
  } = ApiCall();
  const [selectedTab, setSelectedTab] = useState("completed");
  const [nextPage, setNextPage] = useState(1);
  const [pageKey, setPageKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tabSwitch, setTabSwitch] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleTab = (tab) => {
    setSelectedTab(tab);
    setTabSwitch(true);
    setPageKey("");
    setData([]);
  };

  const getContests = async () => {
    if (isLoading || pageKey === null) return;
    setIsLoading(true);
    try {
      if (pageKey !== null) {
        const result = await getContestList(selectedTab, pageKey, "CONTEST");

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

  console.log("data-cont", data);
  useEffect(() => {
    if (selectedTab !== "new") {
      getContests();
    }
    setTabSwitch(false);
  }, [nextPage, tabSwitch]);

  return (
    <Box>
      {/* Header and Tab Buttons */}
      <Box sx={{ display: "flex", gap: 2, marginTop: isMobile && "5%" }}>
        <Typography
          sx={{
            fontSize: isMobile ? "21px" : "32px",
            fontFamily: "Baloo2",
            color: "white",
            margin: isMobile ? "3% 15px" : "6px 0",
          }}
        >
          Contests (12)
        </Typography>
        {/* {["Completed", "Ongoing", "Upcoming"].map((tab) => (
          <Button
            key={tab}
            sx={{
              backgroundImage:
                selectedTab === tab.toLowerCase() ? `url(${buttonBG})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "133px",
              height: "71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: "18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleTab(tab.toLowerCase())}
          >
            {tab}
          </Button>
        ))} */}
      </Box>
      <Box sx={{ display: "flex", gap: '5px', margin: '0 5%' , alignItems: 'center', justifyContent: 'center'}}>
        {["Completed", "Ongoing", "Upcoming"].map((tab) => (
          <Button
            key={tab}
            sx={{
              backgroundImage:
                selectedTab === tab.toLowerCase() ? `url(${buttonBG})` : "none",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: isMobile ? "80px" : "133px",
              height: isMobile?"50px":"71px",
              color: "white",
              fontFamily: "Baloo2",
              fontSize: isMobile?"10px":"18px",
              textTransform: "none",
              boxShadow: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleTab(tab.toLowerCase())}
          >
            {tab}
          </Button>
        ))}
      </Box>
      {/* Create Box + Contest Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          marginTop: "2%",
          width: isMobile ? "100vw" : "100%",
          margin: isMobile ? "0 3%" : "2% 0",
        }}
      >
        {/* Contest List Cards */}
        {data &&
          data.map((item, index) => {
            console.log(
              "ct banner",
              `https://dcp5pbxslacdh.cloudfront.net/CONTESTS/${item.contest_id}/IMAGES/medium/${item.ct_banner}`
            );
            return (
              <Box
                key={index}
                sx={{
                  flex: isMobile
                    ? "1 1 calc(50% -10px)"
                    : "1 1 calc(25% - 25px)",
                  maxWidth: isMobile ? "calc(50%-10px)" : "calc(25% - 25px)",
                  textAlign: "center",
                  height: isMobile ? "200px" : "265px",
                  width: isMobile ? "145px" : "243px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "4",
                  position: "relative",
                }}
              >
                <Box sx={{ height: "60%", width: "100%" }}>
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={`https://dcp5pbxslacdh.cloudfront.net/CONTESTS/${item.contest_id}/IMAGES/medium/${item.ct_banner}`}
                    alt="contest banner"
                  />
                </Box>

                <Box
                  sx={{
                    backdropFilter: "blur(8px)",
                    height: "15%",
                    position: "absolute",
                    top: "50%",
                    width: "100%",
                    borderRadius: "5px",
                    fontSize: isMobile ? "8px" : "12px",
                  }}
                >
                  {`starts in ${item.from}`}
                </Box>

                <Box
                  sx={{
                    height: "40%",
                    padding: "8px",
                    backdropFilter: "blur(18px)",
                    backgroundColor: "transparent)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: isMobile ? "9px" : "12px",
                      fontWeight: 600,
                      fontFamily: "Baloo2",
                      color: "white",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: isMobile ? "7px" : "12px",
                      fontWeight: 600,
                      fontFamily: "Baloo2",
                      color: "white",
                    }}
                  >
                    {`Due: 2 days`}
                  </Typography>
                  <img
                    src={ViewWorksBtn}
                    style={{ width: isMobile && "120px" }}
                  />
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
export default Contest;
