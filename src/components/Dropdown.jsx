"use client";
import { useOutsideClick } from "@/hooks";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * This component renders a reusable dropdown menu component.
 *
 * @component
 * @prop {string | number} width Sets the width of the component
 * @prop {string} label The label to display above the component.
 * @prop {boolean} loading Shows the loading text in the dropdown.
 * @prop {string[]} optionsData The list of options to render in the dropdown for the user to select.
 * @prop {boolean} multiSelect Sets the select component in a multiselect mode or single select mode.
 * @prop {function} selectedCallback The callback that returns the list of currently selected option(s) in the component.
 * @returns {ReactNode} A React element that renders a greeting to the user.
 */
const Dropdown = ({
  width = 300,
  loading = false,
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

  const noOptions = useMemo(
    () => Object.entries(options).length === 0,
    [options]
  );

  return (
    <div style={{ width }} ref={outsideClickRef}>
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
          {multiSelect && !noOptions && !loading && (
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

          {loading ? (
            <li className="list-item disabled" key="loadingOptions">
              <span>Loading Options...</span>
            </li>
          ) : noOptions ? (
            <li className="list-item disabled" key="noOptions">
              <span>No Options Available</span>
            </li>
          ) : (
            Object.entries(options).map(([opt, selected]) => {
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
            })
          )}
        </list>
      )}
    </div>
  );
};

export { Dropdown };
