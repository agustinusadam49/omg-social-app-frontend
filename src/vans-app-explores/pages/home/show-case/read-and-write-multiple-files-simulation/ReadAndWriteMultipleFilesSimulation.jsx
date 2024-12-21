import React, { useRef, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { generateContentFileOps } from "./utils/generateFile";
import InputTextGlobal from "../../../../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../../../../custom-hooks/useFormValidation";
import { setIsClicked } from "../../../../../redux/slices/buttonsSlice";
import RadioGroupGlobal from "../../../../../components/radio-group-global/RadioGroupGlobal";
import {
  processFilesButtonStyle,
  deleteAllFilesButtonStyle,
  chooseFileButtonStyle,
  filesSectionListStyle,
  warningSectionStyle,
} from "./styleObj";
import { diseaseOptions, allWording } from "./constants";

import "./ReadAndWriteMultipleFilesSimulation.scss";

export default function ReadAndWriteMultipleFilesSimulation() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [yearNum, setYearNum] = useState("");

  const [option, setOption] = useState("diare");

  const { isValid, handleInputErrorMessage } = useFormValidation({
    rulesSchema: {
      monthName: {
        currentValue: monthName,
        isRequired: true,
      },
      yearNum: {
        currentValue: yearNum,
        isRequired: true,
      },
    },
  });

  const handleAddFiles = (targetFiles) => {
    const itemData = targetFiles;

    const isDuplicate = files.filter(
      (item) => item.name === itemData.name
    ).length;

    if (isDuplicate) return;

    setFiles((oldArray) => [...oldArray, itemData]);

    let fileItemRef = document.getElementById("file-ref-id");
    fileItemRef.value = "";
  };

  const handleProcessFiles = async () => {
    dispatch(setIsClicked({ payload: true }));

    if (!isValid) return;

    await generateContentFileOps({
      readPath: files,
      writePath: `data-${option}-bulan-${monthName}-${yearNum}-full.xlsx`,
      sheetName: "Sheet1",
      diseaseType: option,
    });
  };

  const handleDeleteAllFiles = () => {
    setFiles([]);
    setMonthName("");
    setYearNum("");
    setOption("diare");
  };

  return (
    <div className="read-and-write-wrapper">
      <div className="read-and-write-title">{allWording.featureTitle}</div>

      <div style={warningSectionStyle}>
        <h1>{allWording.h1Warning}</h1>
        <p>{allWording.paragraphOne}</p>{" "}
        <ul>
          {allWording.whatToChange.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {!!files.length &&
        files.map((item) => (
          <div key={item.name} style={filesSectionListStyle}>
            {item.name}
          </div>
        ))}

      <input
        ref={fileRef}
        id="file-ref-id"
        type="file"
        hidden
        onChange={(e) => handleAddFiles(e.target.files[0])}
      />

      <div
        style={chooseFileButtonStyle}
        onClick={() => fileRef.current.click()}
      >
        Choose File
      </div>

      {!!files.length && (
        <div style={deleteAllFilesButtonStyle} onClick={handleDeleteAllFiles}>
          Delete All Files
        </div>
      )}

      {!!files.length && (
        <Fragment>
          <InputTextGlobal
            value={monthName}
            onChange={(e) => setMonthName(e.target.value)}
            inputErrorMessage={handleInputErrorMessage("monthName")}
            inputPlaceholder={"Masukkan Nama Bulan"}
          />

          <InputTextGlobal
            value={yearNum}
            onChange={(e) => setYearNum(e.target.value)}
            inputErrorMessage={handleInputErrorMessage("yearNum")}
            inputPlaceholder={"Masukkan Tahun"}
          />

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <RadioGroupGlobal
              mainValue={option}
              setInputValue={setOption}
              radioItems={diseaseOptions}
            />
          </div>
        </Fragment>
      )}

      {!!files.length && (
        <div style={processFilesButtonStyle} onClick={handleProcessFiles}>
          Process Files
        </div>
      )}
    </div>
  );
}
