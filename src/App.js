import * as React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login/index";
import Home from './Pages/home/index';
import Work from "./Pages/work/work";
import Header from "./Pages/Header/header";
import Profile from "./Pages/profile/Profile";
import Books from "./Pages/Books/books";
import Detail from "./Pages/Books/detail";
import StorageConsumption from "./Pages/StorageConsumption/storageConsumption";
import Contests from "./Pages/Contests/contests";
import ContestDetail from "./Pages/Contests/contestDetail";
import { useState } from "react";
import DeletedPost from "./Pages/DeletedPost/deletedPost";
import DeletedUser from "./Pages/DeletedUser/index";
import DeletedUserDetail from "./Pages/DeletedUser/deletedUserDetail";
import DeletedUserWorks from "./Pages/DeletedUser/deletedUserWorks";
import QuestDetail from "./Pages/Quests/questDetail";
import BotWorks from "./Pages/Bot Wroks/work";
import Quests from "./Pages/Quests/index";
import Comments from "./Pages/comments/comments";
import Achievement from "./Pages/Achievement";
import Events from "./Pages/events";
import CreateContest from "./Pages/Contests/createContest";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import "../src/font.css";
import background from './asserts/BGADMIN.png';

const theme = createTheme({
  typography: {
    fontFamily: "'Baloo2'",
  },
});

// Separate AppContent component to use useLocation hook
const AppContent = ({ userDetails, setUserDetails, profilePic, setProfilePic }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isHomePage = location.pathname === "/home";

  return (
    <>
      {!isLoginPage && !isHomePage && <Header userDetails={userDetails} profilePic={profilePic} />}
      <Box
        sx={{
          backgroundImage: !isLoginPage ?`url(${background})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          margin:0,
          padding: 0,
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />}/>
          <Route
            path="/work"
            element={<Work setUserDetails={setUserDetails} setProfilePic={setProfilePic} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/books" element={<Books />} />
          <Route path="/booksdetail/:userId/:bookId" element={<Detail />} />
          <Route path="/storage-consumption" element={<StorageConsumption />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contestdetail" element={<ContestDetail />} />
          <Route path="/deleted-post" element={<DeletedPost />} />
          <Route path="/deleted-user" element={<DeletedUser />} />
          <Route path="/deleted-user/:userId" element={<DeletedUserDetail />} />
          <Route path="/deleted-user/:userId/works" element={<DeletedUserWorks />} />
          <Route path="/quests-Works" element={<QuestDetail />} />
          <Route
            path="/bot-works"
            element={<BotWorks setUserDetails={setUserDetails} setProfilePic={setProfilePic} />}
          />
          <Route path="/quests" element={<Quests />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/events" element={<Events />} />
          <Route path="/achievements" element={<Achievement />} />
          <Route path="/createContest/Quest" element={<CreateContest />} />
        </Routes>
      </Box>
    </>
  );
};

export default function App() {
  const [userDetails, setUserDetails] = useState([]);
  const [profilePic, setProfilePic] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        />
      </Router>
    </ThemeProvider>
  );
}
