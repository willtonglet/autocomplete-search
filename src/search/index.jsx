import React from "react";
import "./styles.scss";

const SearchIcon = ({ fill, width, height }) => (
  <svg
    focusable="false"
    fill={fill}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const CloseIcon = ({ fill, width, height }) => (
  <svg
    focusable="false"
    fill={fill}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
  </svg>
);

function Search({ placeholder, onChange, options }) {
  const [active, setActive] = React.useState(false);
  const [clear, setClear] = React.useState(false);
  const [isFocused, setOnFocus] = React.useState(false);
  const [activeOption, setActiveOption] = React.useState(-1);
  const [prevActiveOption, setPrevActiveOption] = React.useState(-1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const searchRef = React.useRef(null);

  const handleChange = e => {
    if (!active) {
      setActive(true);
      setActiveOption(-1);
      setPrevActiveOption(-1);
    }

    const val = e.target.value;
    const match = new RegExp(
      `${val.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`,
      "gmi"
    );
    const nowVisible = [];
    const executeRegex = new Promise(resolve => {
      options.forEach((option, index, array) => {
        const normalizedLabel = option.label
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        if (match.test(normalizedLabel) || match.test(option.label)) {
          nowVisible.push(option);
        } else if (match.test(option.label)) {
          nowVisible.push(option);
        }

        if (index === array.length - 1) {
          resolve();
        }
      });
    });

    setSearchTerm(val);
    executeRegex.then(() => {
      setSearchResults(nowVisible);
    });
    setActiveOption(-1);
    setPrevActiveOption(-1);
  };

  React.useEffect(() => {
    if (searchValue) onChange(searchValue);
    if (searchTerm.length === 0) {
      setClear(false);
    } else if (searchTerm.length > 0) {
      setClear(true);
    }
  }, [searchTerm, onChange, searchValue]);

  const renderValue = e => {
    setSearchTerm(e.label);
    setSearchValue(e.value);
    setActiveOption(-1);
    setPrevActiveOption(-1);
    setActive(false);
  };

  React.useEffect(() => {
    const handleClickOutside = e => {
      if (!searchRef.current.contains(e.target)) {
        setActive(false);
        setOnFocus(false);
      }
    };
    document.addEventListener("click", handleClickOutside, false);
    return () =>
      document.removeEventListener("click", handleClickOutside, false);
  }, [searchRef]);

  const clearValue = () => setSearchTerm("");

  const handleKey = e => {
    const keyDown = 40;
    const keyUp = 38;
    const keyEnter = 13;
    const keyEsc = 27;

    if (e.keyCode === keyEsc) {
      setActive(false);
    } else if (activeOption === -1 && e.keyCode === keyDown) {
      setPrevActiveOption(activeOption);
      setActiveOption(0);
    } else if (
      e.keyCode === keyDown &&
      activeOption < searchResults.length - 1
    ) {
      setPrevActiveOption(activeOption);
      setActiveOption(activeOption + 1);
    } else if (e.keyCode === keyUp && activeOption !== 0) {
      setPrevActiveOption(activeOption);
      setActiveOption(activeOption - 1);
    } else if (activeOption >= 0 && e.keyCode === keyEnter) {
      setSearchTerm(searchResults[activeOption].label);
      setSearchValue(searchResults[activeOption].value);
      setActive(false);
    }
  };

  React.useEffect(() => {
    const selectedItem = document.querySelector(`#item${activeOption}`);
    const prevSelectedItem = document.querySelector(`#item${prevActiveOption}`);

    if (selectedItem && prevSelectedItem) {
      selectedItem.className = "Search__item focused";
      prevSelectedItem.className = "Search__item";
    } else if (selectedItem) {
      selectedItem.className = "Search__item focused";
    }
  }, [activeOption, prevActiveOption]);

  const renderOptions = () => {
    if (active && searchResults.length > 0) {
      return (
        <div className="Search__options">
          <ul>
            {searchResults.map((option, i) => (
              <li
                className="Search__item"
                role="button"
                key={`${option.value}-${i}`}
                id={`item${i}`}
                tabIndex={-1}
                onClick={() => renderValue(option)}
                onKeyPress={() => renderValue(option)}
              >
                <SearchIcon fill="#000" width="20" height="20" />
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    if (active && searchResults.length === 0) {
      return (
        <div className="Search__options">
          <p>Not Found</p>
        </div>
      );
    }
  };

  return (
    <div className="Search" ref={searchRef}>
      <div
        className={`Search__wrap ${isFocused && "onFocus"} ${active &&
          "active"}`}
      >
        {isFocused && <SearchIcon fill="#000" width="20" height="20" />}
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          className="Search__input"
          onFocus={() => setOnFocus(true)}
          onKeyDown={e => handleKey(e)}
          tabIndex={0}
        />
        {clear && (
          <button className="Search__close" type="button" onClick={clearValue}>
            <CloseIcon width="20" height="20" fill="balck" />
          </button>
        )}
      </div>
      {renderOptions()}
    </div>
  );
}

export default Search;
