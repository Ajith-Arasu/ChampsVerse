import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";


const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Player
        autoplay
        loop
        src="/loader_lottie.json"
        style={{ height: "150px", width: "150px" }}
      />
    </div>
  );
};

export default Loader;
