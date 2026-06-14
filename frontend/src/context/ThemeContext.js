import {

  createContext,

  useContext,

  useEffect,

  useState

} from "react";

const ThemeContext = createContext();

export function ThemeProvider({

  children
}) {

  const [theme, setTheme] = useState(

    localStorage.getItem("theme") ||

    "dark"
  );

  // =========================================
  // APPLY THEME
  // =========================================
  useEffect(() => {

    if (theme === "dark") {

      document.documentElement.classList.add(

        "dark"
      );

    } else {

      document.documentElement.classList.remove(

        "dark"
      );
    }

    localStorage.setItem(

      "theme",

      theme
    );

  }, [theme]);

  // =========================================
  // TOGGLE THEME
  // =========================================
  const toggleTheme = () => {

    setTheme(

      theme === "dark"

      ? "light"

      : "dark"
    );
  };

  return (

    <ThemeContext.Provider

      value={{

        theme,

        toggleTheme
      }}
    >

      {children}

    </ThemeContext.Provider>
  );
}

export function useTheme() {

  return useContext(

    ThemeContext
  );
}