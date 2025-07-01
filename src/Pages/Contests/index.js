import { Typography, Box, Button } from "@mui/material";
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

  useEffect(() => {
    if (selectedTab !== "new") {
      getContests();
    }
    setTabSwitch(false);
  }, [nextPage, tabSwitch]);

  return (
    <Box>
      {/* Header and Tab Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography
          sx={{
            fontSize: "32px",
            fontFamily: "Baloo2",
            marginTop: "6px",
            color: "white",
          }}
        >
          Contests (12)
        </Typography>
        {["Completed", "Ongoing", "Upcoming"].map((tab) => (
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
        ))}
      </Box>

      {/* Create Box + Contest Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          marginTop: "2%",
        }}
      >
        {/* Create Contest Box */}
        <Box
          sx={{
            height: "265px",
            width: "273px",
            background: "linear-gradient(60deg, #7B2FF7 0%, #6527D1 100%)",
            borderRadius: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flex: "1 1 calc(25% - 25px)", // match other card sizing
            maxWidth: "calc(25% - 25px)",
          }}
        >
          <Typography
            sx={{
              fontSize: "64px",
              fontWeight: 800,
              fontFamily: "baloo2",
              color: "white",
            }}
          >
            +
          </Typography>
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: 800,
              fontFamily: "baloo2",
              color: "white",
            }}
          >
            Create
          </Typography>
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: 800,
              fontFamily: "baloo2",
              color: "white",
            }}
          >
            Contest
          </Typography>
        </Box>

        {/* Contest List Cards */}
        {data &&
          data.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 calc(25% - 25px)",
                maxWidth: "calc(25% - 25px)",
                textAlign: "center",
                height: "265px",
                width: "243px",
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
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Baloo2",
                    color: "white",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Baloo2",
                    color: "white",
                  }}
                >
                  {`Due: 2 days`}
                </Typography>
                <img src={ViewWorksBtn} />
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};
export default Contest;
