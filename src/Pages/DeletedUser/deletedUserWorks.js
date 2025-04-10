import style from "../DeletedUser/style.module.css";
import { Checkbox } from "@mui/material";
import { useState } from "react";

const DeletedUserWorks = ({ userId, data }) => {
  console.log("userId:", userId);
  console.log("Data:", data);
  const CDN_URL=process.env.REACT_APP_CDN_URL;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [checkedItems, setCheckedItems] = useState([]);
  
  const handleSelect = (workId, userId,deleted_at) => (event) => {
      setCheckedItems((prevCheckedItems) => {
        if (event.target.checked) {
          return [...prevCheckedItems, { workId, userId }];
        } else {
          return prevCheckedItems.filter(
            (item) => item.workId !== workId || item.userId !== userId
          );
        }
      });
  };

  return (
    <div className={style["grid-container"]}>
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.post_id} className={style["grid-item"]}>

            <img
              style={{ height: "100%", width: "100%" }}
              src={`${CDN_URL}/${item.user_id}/WORKS/IMAGES/medium/${item.files[0].name}`}
            ></img>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DeletedUserWorks;
