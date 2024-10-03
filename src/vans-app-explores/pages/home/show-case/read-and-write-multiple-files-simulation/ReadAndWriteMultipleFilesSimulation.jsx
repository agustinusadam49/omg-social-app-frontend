import React, { useRef, useState, useMemo, Fragment } from "react";
import { useDispatch } from "react-redux";
import { generateContentFileOps } from "./utils/generateFile";
import InputTextGlobal from "../../../../../components/input-text-global/InputTextGlobal";
import { getFirstError } from "../../../../../utils/formValidationFunction";
import { useFormValidation } from "../../../../../custom-hooks/useFormValidation";
import { setIsClicked } from "../../../../../redux/slices/buttonsSlice";
import RadioGroupGlobal from "../../../../../components/radio-group-global/RadioGroupGlobal";

import "./ReadAndWriteMultipleFilesSimulation.scss";

const DIARE_LISTS = [
  {
    disease:
      "Diarrhoea and gastroenteritis of presumed infectious origin (A09)",
    isAntibiotic: true,
  },
  {
    disease: "Gastroenteritis and colitis of unspecified origin (A09.9)",
    isAntibiotic: false,
  },
  {
    disease: "Other noninfective gastroenteritis and colitis (K52)",
    isAntibiotic: false,
  },
];

const ISPA_LISTS = [
  {
    disease: "Acute pharyngitis (J02)",
    isAntibiotic: true,
  },
  {
    disease: "Acute tonsillitis (J03)",
    isAntibiotic: true,
  },
  {
    disease:
      "Acute upper respiratory infections of multiple and unspecified sites (J06)",
    isAntibiotic: false,
  },
  {
    disease: "Bronchopneumonia, unspecified (J18.0)",
    isAntibiotic: true,
  },
  {
    disease: "Cough (R05)",
    isAntibiotic: true,
  },
  {
    disease: "Acute nasopharyngitis [common cold] (J00)",
    isAntibiotic: false,
  },
  {
    disease: "Acute upper respiratory infection, unspecified (J06.9)",
    isAntibiotic: false,
  },
];

export default function ReadAndWriteMultipleFilesSimulation() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [monthName, setMonthName] = useState("");
  const [yearNum, setYearNum] = useState("");

  const [option, setOption] = useState("diare");

  const loginRulesSchema = useMemo(
    () => ({
      monthName: {
        currentValue: monthName,
        isRequired: true,
      },
      yearNum: {
        currentValue: yearNum,
        isRequired: true,
      },
    }),
    [monthName, yearNum]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: loginRulesSchema,
  });

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
  };

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
      handleProcessData: (dataArrObj) => {
        const dataHasBeenCapped = [];

        const diagnoseList = option === "diare" ? DIARE_LISTS : ISPA_LISTS;

        for (let i = 0; i < diagnoseList.length; i++) {
          const slicedData = dataArrObj
            .filter((item) => item.diagnoseOne === diagnoseList[i].disease)
            .slice(0, 1)
            .map((item) => ({
              number: item.number,
              date: item.date,
              patientName: item.patientName,
              ermNumber: item.ermNumber,
              patientAge: item.patientAge,
              monthAge: item.monthAge,
              medicalPersonnel: item.medicalPersonnel,
              diagnoseOne: item.diagnoseOne,
              isAntibiotic: diagnoseList.filter(
                (listOfDiagnose) => listOfDiagnose.disease === item.diagnoseOne
              )[0].isAntibiotic,
              receipt: item.receipt,
            }));

          dataHasBeenCapped.push(...slicedData);
        }

        return dataHasBeenCapped;
      },
    });
  };

  return (
    <div className="read-and-write-wrapper">
      <div className="read-and-write-title">Fitur File processing: Laporan Harian Pelayanan Pasien Diare & Ispa</div>

      <div
        style={{
          border: "1px solid pink",
          padding: "6px",
          borderRadius: "8px",
          marginBottom: "10px",
          background: "pink",
        }}
      >
        <h1>Perhatian</h1>
        <p>
          File harus bersih artinya hanya berisi table saja, dan rubah nama
          kolom sesuai keterangan di Bawah ini:
        </p>{" "}
        <ul>
          <li>No. menjadi number</li>
          <li>Tanggal menjadi date</li>
          <li>Nama Pasien menjadi patientName</li>
          <li>No. eRM menjadi ermNumber</li>
          <li>Umur Tahun menjadi patientAge</li>
          <li>Umur Bulan menjadi monthAge</li>
          <li>Dokter / Tenaga Medis menjadi medicalPersonnel</li>
          <li>Diagnosa 1 menjadi diagnoseOne</li>
          <li>Resep menjadi receipt</li>
        </ul>
      </div>

      {!!files.length &&
        files.map((item) => (
          <div
            key={item.name}
            style={{
              border: "1px solid blue",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "6px",
              background: "orange",
            }}
          >
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
        style={{
          border: "1px solid blue",
          cursor: "pointer",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          background: "blue",
          marginBottom: "10px",
          color: "white",
        }}
        onClick={() => fileRef.current.click()}
      >
        Choose File
      </div>

      <div
        style={{
          border: "1px solid blue",
          cursor: "pointer",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          background: "red",
          color: "white",
          marginBottom: "10px",
        }}
        onClick={() => setFiles([])}
      >
        Delete All Files
      </div>

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
              radioItems={[
                {
                  label: "Diare",
                  value: "diare",
                },
                {
                  label: "Ispa",
                  value: "ispa",
                },
              ]}
            />
          </div>
        </Fragment>
      )}

      {!!files.length && (
        <div
          style={{
            border: "1px solid blue",
            cursor: "pointer",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            background: "blue",
            color: "white",
            marginBottom: "10px",
          }}
          onClick={handleProcessFiles}
        >
          Process Files
        </div>
      )}
    </div>
  );
}
