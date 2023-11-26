import React from "react";
import { useSelector } from "react-redux";
import RoundedLoader from "../rounded-loader/RoundedLoader";

import "./PostLoadDataModal.scss";

export default function PostLoadDataModal() {
  const loadItemsSlice = useSelector(({ posts }) => posts.postLoadItems);

  return (
    <div className="content-container post-load-data-modal">
      <div className="post-load-data-wrapper">
        <div className="post-load-data-title">Saving Data, Please wait .....</div>
        <div className="status-upload-and-post">
          {loadItemsSlice.map((item, idx) => (
            <div
              className={`wording-status-wrapper ${
                item.pendingStatus
                  ? "pending-status"
                  : item.loadingStatus
                  ? "loading-status"
                  : "success-status"
              }`}
              key={idx}
            >
              {item.pendingStatus && <div>Waiting</div>}
              {item.loadingStatus && (
                <RoundedLoader
                  baseColor="gray"
                  secondaryColor="white"
                  size={15}
                />
              )}
              {item.successStatus && <div>Success</div>}
              <div>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
