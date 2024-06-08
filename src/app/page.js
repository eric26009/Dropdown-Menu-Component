"use client";
import { Dropdown } from "@/components";
import React from "react";
import { testList1 } from "../../public/testData";

const HomePage = () => {
  return (
    <div className="homepage">
      <Dropdown
        label="Multiselect Movies"
        width={300}
        optionsData={testList1}
        multiSelect
        selectedCallback={(selected) =>
          console.log("Selected option(s):", selected)
        }
      />
      <Dropdown
        label="Single Select Movies"
        width={300}
        optionsData={testList1}
        selectedCallback={(selected) =>
          console.log("Selected option(s):", selected)
        }
      />
    </div>
  );
};

export default HomePage;
