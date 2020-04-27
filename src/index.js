import React from "react";
import ReactDOM from "react-dom";
import Search from "./search";

const options = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "react-native", label: "React Native" },
  { value: "javascript", label: "Javascript" }
];

function App() {
  return (
    <div>
      <Search options={options} placeholder="Search" onChange={console.log} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
