import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ptBR } from "@material-ui/core/locale";
import { QueryClient, QueryClientProvider } from "react-query";
import ColorModeContext from "./layout/themeContext";


const queryClient = new QueryClient();
const App = () => {
	const [locale, setLocale] = useState();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredTheme = window.localStorage.getItem("preferredTheme");
  const [mode, setMode] = useState(
    preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light"
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = createTheme(
    {
      scrollbarStyles: {
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
          backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
        },
      },
      palette: {
        type: mode,
        primary: { main: "#366cf5" },
        textPrimary: mode === "light" ? "#366cf5" : "#FFFFFF",
        borderPrimary: mode === "light" ? "#366cf5" : "#FFFFFF",
        dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
        light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
        tabHeaderBackground: mode === "light" ? "#EEE" : "#666",
        optionsBackground: mode === "light" ? "#fafafa" : "#333",
        fancyBackground: mode === "light" ? "#fafafa" : "#333",
        total: mode === "light" ? "#fff" : "#222",
        messageIcons: mode === "light" ? "grey" : "#F3F3F3",
        inputBackground: mode === "light" ? "#FFFFFF" : "#333",
      },
      mode,
    },
    locale
  );

	useEffect(() => {
		const i18nlocale = localStorage.getItem("i18nextLng");
		const browserLocale =
			i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

		if (browserLocale === "ptBR") {
			setLocale(ptBR);
		}
	}, []);

  useEffect(() => {
		window.localStorage.setItem("preferredTheme", mode);
	}, [mode]);

	return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
	);
};

export default App;
