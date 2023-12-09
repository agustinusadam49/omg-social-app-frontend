import React, { useState, useMemo } from "react";
import { useFormValidation } from "../../../custom-hooks/useFormValidation";
import InputTextGlobal from "../../../components/input-text-global/InputTextGlobal";
import GlobalButton from "../../../components/button/GlobalButton";
import { useDispatch } from "react-redux";
import { setIsClicked } from "../../../redux/slices/buttonsSlice";

import "./Home.scss";

const INITIAL_WHAT_YOU_GET = [
  {
    benefit: "",
  },
];

export default function Home() {
  const dispatch = useDispatch();

  const [whatYouGet, setWhatYouGet] = useState(INITIAL_WHAT_YOU_GET);

  const [currentOption, setCurrentOption] = useState("otherOption");

  const benefitFieldRules = useMemo(
    () => ({
      benefit: whatYouGet.map((item) => ({
        currentValue: item.benefit,
        isRequired: true,
      })),
    }),
    [whatYouGet]
  );

  const { isValid, errorMessage } = useFormValidation({
    rulesSchema: benefitFieldRules,
  });

  const handleInputErrorMessageBenefit = (index) => {
    return [errorMessage.benefit[index]].filter((item) => !!item);
  };

  const addWhatYouGet = () => {
    const newBenefitObj = { benefit: "" };
    setWhatYouGet((oldArray) => [...oldArray, newBenefitObj]);
  };

  const handleChange = (target) => {
    const index = parseInt(target.name);

    const newArr = whatYouGet.map((item, benefitIdx) => {
      if (benefitIdx === index) {
        return {
          ...item,
          benefit: target.value,
        };
      } else {
        return item;
      }
    });

    setWhatYouGet(newArr);
  };

  const submitBenefit = () => {
    dispatch(setIsClicked({ payload: true }));
    if (isValid) {
      const newArr = whatYouGet.map((item) => item.benefit);
      console.log("whatYouGet", newArr);
    }
  };

  const deleteThisBenefit = (idxBenefit) => {
    if (idxBenefit === 0 && whatYouGet.length < 2) return;
    const newArr = whatYouGet.filter((_, idx) => idx !== idxBenefit);
    setWhatYouGet(newArr);
  };

  return (
    <div className="main-vans-home">
      <div className="main-vans-home-title">
        This is a HOME page of VANS web app
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
        perferendis aspernatur sit necessitatibus quia cumque ratione
        praesentium perspiciatis quaerat obcaecati nesciunt dicta saepe, fugiat
        unde. Corporis in ullam quo quas.
      </p>

      <div className="what-you-get-wrapper">
        {whatYouGet.length &&
          whatYouGet.map((item, index) => (
            <div key={index} className="what-you-get-input-and-delete-wrapper">
              <div className="input-benefit-wrapper">
                <InputTextGlobal
                  key={index}
                  value={item.benefit}
                  onChange={(e) => handleChange(e.target)}
                  inputErrorMessage={handleInputErrorMessageBenefit(index)}
                  inputPlaceholder={"Masukkan Benefit"}
                  name={index}
                />
              </div>

              <div
                className={`delete-button ${
                  whatYouGet.length < 2 ? "disabled" : ""
                }`}
                onClick={() => deleteThisBenefit(index)}
              >
                Hapus
              </div>
            </div>
          ))}

        <GlobalButton
          buttonLabel="Add What You Get"
          classStyleName="login-button"
          onClick={addWhatYouGet}
        />

        <GlobalButton
          buttonLabel="Submit Benefit"
          classStyleName="login-button"
          onClick={submitBenefit}
        />
      </div>

      <select
        value={currentOption}
        onChange={(e) => setCurrentOption(e.target.value)}
      >
        <option value="someOption">Some option</option>
        <option value="otherOption">Other option</option>
      </select>

      <div>Current Option: {currentOption || "belum pilih"}</div>
    </div>
  );
}
