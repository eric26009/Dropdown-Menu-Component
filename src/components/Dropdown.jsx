"use client";
import { useOutsideClick } from "@/hooks";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const Dropdown = ({
  label = "",
  optionsData = [],
  multiSelect = false,
  selectedCallback
}) => {
  const [options, setOptions] = useState({});
  const [openList, setOpenList] = useState(false);

  const formatOptions = (data, selectAll = false) => {
    return data.reduce((prev, curr) => {
      prev[curr] = selectAll ? true : false;
      return prev;
    }, {});
  };

  useEffect(() => {
    const optionsFormatted = formatOptions(optionsData, false);
    setOptions(optionsFormatted);
  }, [optionsData]);

  useEffect(() => {
    selectedCallback(
      Object.entries(options)
        .filter(([, state]) => state)
        .map((i) => i[0])
    );
  }, [options, selectedCallback]);

  const outsideClickRef = useOutsideClick(() => setOpenList(false));

  const onSelectAll = () => {
    const optionsFormatted = formatOptions(optionsData, true);
    setOptions(optionsFormatted);
  };

  const onDeselectAll = () => {
    const optionsFormatted = formatOptions(optionsData, false);
    setOptions(optionsFormatted);
  };

  const selectedFormatted = useMemo(
    () =>
      Object.entries(options)
        .filter(([, state]) => state)
        .map((i) => i[0])
        .join(", "),
    [options]
  );

  const updateSelected = useCallback(
    (option) => {
      if (multiSelect) {
        setOptions((data) => ({ ...data, [option]: !data[option] }));
      } else {
        const optionsFormatted = formatOptions(optionsData, false);
        setOptions({ ...optionsFormatted, [option]: true });
        setOpenList(false);
      }
    },
    [multiSelect, optionsData]
  );

  const atLeastOneSelected = useMemo(() => {
    return Object.entries(options)
      .map(([, value]) => value)
      .some((val) => val);
  }, [options]);

  const atLeastOneNotSelected = useMemo(() => {
    return Object.entries(options)
      .map(([, value]) => value)
      .some((val) => !val);
  }, [options]);

  return (
    <div style={{ width: 300 }} ref={outsideClickRef}>
      <fieldset
        className="input"
        onClick={() => setOpenList((state) => !state)}
      >
        <legend>{label}</legend>

        <span className={`selected-text ${!selectedFormatted && "empty"}`}>
          {selectedFormatted ? selectedFormatted : "Select from list..."}
        </span>

        <Image
          style={{ alignSelf: "center" }}
          priority
          src={openList ? "/chevron-down-solid.svg" : "/chevron-up-solid.svg"}
          alt={openList ? "list closed" : "list opened"}
          width={25}
          height={25}
        />
      </fieldset>
      {openList && (
        <list className="list">
          {multiSelect && (
            <>
              <li
                className={`list-item ${!atLeastOneNotSelected && "disabled"}`}
                key="selectAll"
                onClick={onSelectAll}
              >
                <span>Select All</span>
              </li>
              <li
                className={`list-item ${!atLeastOneSelected && "disabled"}`}
                key="selectAll"
                onClick={onDeselectAll}
              >
                <span>Deselect All</span>
              </li>
            </>
          )}

          {Object.entries(options).map(([opt, selected]) => {
            return (
              <li
                key={opt}
                onClick={() => {
                  updateSelected(opt);
                }}
                className={selected && "selected"}
              >
                {multiSelect && (
                  <Image
                    priority
                    src={
                      selected
                        ? "/circle-check-regular.svg"
                        : "/circle-regular.svg"
                    }
                    alt="list open"
                    width={20}
                    height={20}
                    className={selected && "selected"}
                  />
                )}
                <span style={{ backgroundColor: "inherit" }}>{opt}</span>
              </li>
            );
          })}
        </list>
      )}
    </div>
  );
};

export { Dropdown };
