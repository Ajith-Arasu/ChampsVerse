import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/home/home";
import Work from "./Pages/work/work";
import Header from "./Pages/Header/header";
import Profile from "./Pages/profile/Profile";
import Books from "./Pages/Books/books"
import Detail from "./Pages/Books/detail"
import StorageConsumption from "./Pages/StorageConsumption/storageConsumption"
import Contests from "./Pages/Contests/contests"
import ContestDetail from "./Pages/Contests/contestDetail"
import { useState } from "react";
import DeletedPost from "./Pages/DeletedPost/deletedPost"
import DeletedUser from "./Pages/DeletedUser/index"
import DeletedUserDetail from "./Pages/DeletedUser/deletedUserDetail";
import DeletedUserWorks from "./Pages/DeletedUser/deletedUserWorks";


export default function App() {
  const [userDetails, setUserDetails] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  return (
    <>
      <Router>
        <Header userDetails={userDetails} profilePic={profilePic} />
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work setUserDetails={setUserDetails} setProfilePic={setProfilePic} />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/books" element={<Books/>}/>
            <Route path="/booksdetail/:userId/:bookId" element={<Detail/>}/>
            <Route path="/storage-consumption" element={<StorageConsumption/>}/>
            <Route path="/contests" element={<Contests/>}/>
            <Route path="/contestdetail" element={<ContestDetail/>}/>
            <Route path="/deleted-post" element={<DeletedPost/>}/>
            <Route path="/deleted-user" element={<DeletedUser/>}/>
            <Route path="/deleted-user/:userId" element={<DeletedUserDetail/>}/>
            <Route path="/deleted-user/:userId/works" element={<DeletedUserWorks/>}/>
          </Routes>
        </>
      </Router>
    </>
  );
}
