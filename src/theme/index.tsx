import { SvgIcon, Theme, ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CSSProperties } from "react";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const theme = createTheme();
const {
  typography: { pxToRem },
} = theme;

const FONT = "Inter, sans-serif";

declare module "@mui/material/styles/createPalette" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PaletteColor extends ColorPartial {}

  interface TypeText {
    muted: string;
    light: string;
  }

  interface TypeBackground {
    default: string;
    paper: string;
    surface: string;
    surface2: string;
    header: string;
    disabled: string;
  }

  interface Palette {
    gradients?: {
      primary: string;
      secondary: string;
    };
    other: {
      splyceAccent: string;
      splyceLink: string;
    };
  }
}

interface TypographyCustomVariants {
  display1: CSSProperties;
  subheader1: CSSProperties;
  subheader2: CSSProperties;
  description: CSSProperties;
  buttonL: CSSProperties;
  buttonM: CSSProperties;
  buttonS: CSSProperties;
  helperText: CSSProperties;
  tooltip: CSSProperties;
  main21: CSSProperties;
  secondary21: CSSProperties;
  main16: CSSProperties;
  secondary16: CSSProperties;
  main14: CSSProperties;
  secondary14: CSSProperties;
  main12: CSSProperties;
  secondary12: CSSProperties;
}

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TypographyVariants extends TypographyCustomVariants {}

  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TypographyVariantsOptions extends TypographyCustomVariants {}

  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    display1: true;
    subheader1: true;
    subheader2: true;
    description: true;
    buttonL: true;
    buttonM: true;
    buttonS: true;
    helperText: true;
    tooltip: true;
    main21: true;
    secondary21: true;
    main16: true;
    secondary16: true;
    main14: true;
    secondary14: true;
    main12: true;
    secondary12: true;
    h5: true;
    h6: true;
    subtitle1: true;
    subtitle2: true;
    body1: true;
    body2: true;
    button: false;
    overline: false;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    surface: true;
    gradient: true;
  }
}

export const getDesignTokens = () => {
  return {
    breakpoints: {
      keys: ["xs", "xsm", "sm", "md", "lg", "xl", "xxl"],
      values: {
        xs: 0,
        xsm: 480,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1800,
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#BBFB5B",
        light: "#7B9EA6",
        dark: "#183102",
      },
      secondary: {
        main: "#7D91B5",
        light: "#F6A5C0",
        dark: "#AA647B",
      },
      error: {
        main: "#F44336",
        light: "#E57373",
        dark: "#D32F2F",
        "100": "#FBB4AF", // for alert text
        "200": "#2E0C0A", // for alert background
        "300": "#5a0000", // for alert border
      },
      warning: {
        main: "#f7b06e",
        light: "#FFB74D",
        dark: "#F57C00",
        "100": "#f7b06e", // for alert text
        "200": "#452508", // for alert background
        "300": "#5c310a", // for alert border
      },
      info: {
        main: "#29B6F6",
        light: "#4FC3F7",
        dark: "#0288D1",
        "100": "#A9E2FB", // for alert text
        "200": "#071F2E", // for alert background
      },
      success: {
        main: "#3DA329",
        light: "#90FF95",
        dark: "#388E3C",
        "100": "#C2E4C3", // for alert text
        "200": "#0A130B", // for alert background
      },
      text: {
        primary: "#fff",
        secondary: "#7b9ea6",
        light: "#c5d7f2",
        disabled: "#62677B",
        muted: "#65858c",
        highlight: "#a0f2c4",
      },
      background: {
        default: "#1F2632",
        paper: "#314156",
        surface: "#072a40",
        surface2: "#072a40",
        header: "#101d32",
        disabled: "#EBEBEF14",
      },
      divider: "#3A4F6A",
      action: {
        active: "#EBEBEF8F",
        hover: "#CFFF81",
        selected: "#072a40",
        disabled: "#EBEBEF4D",
        disabledBackground: "#EBEBEF1F",
        focus: "0px 0px 8px 0px rgba(207, 255, 129, 0.80)",
      },
      other: {
        splyceAccent: "#CFFF81",
        splyceLink: "#a8bfb0",
      },
      gradients: {
        primary: "linear-gradient(104deg, #59799D 0%, #9FF229 100%)",
        secondary: "linear-gradient(104deg, #CFFF81 0%, #9FF229 100%)",
      },
    },
    spacing: 8,
    typography: {
      fontFamily: FONT,
      h5: undefined,
      h6: undefined,
      subtitle1: undefined,
      subtitle2: undefined,
      body1: undefined,
      body2: undefined,
      button: undefined,
      overline: undefined,
      display1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(32),
      },
      h1: {
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: pxToRem(0.25),
        lineHeight: "123.5%",
        fontSize: pxToRem(28),
      },
      h2: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: "unset",
        lineHeight: "133.4%",
        fontSize: pxToRem(20),
      },
      h3: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: "160%",
        fontSize: pxToRem(18),
      },
      h4: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      subheader1: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      subheader2: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      description: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: "143%",
        fontSize: pxToRem(14),
      },
      caption: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      buttonL: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      buttonM: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: pxToRem(24),
        fontSize: pxToRem(14),
      },
      buttonS: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.46),
        lineHeight: pxToRem(20),
        textTransform: "uppercase",
        fontSize: pxToRem(10),
      },
      helperText: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.4),
        lineHeight: pxToRem(12),
        fontSize: pxToRem(10),
      },
      tooltip: {
        fontFamily: FONT,
        fontWeight: 400,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      main21: {
        fontFamily: FONT,
        fontWeight: 600,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      secondary21: {
        fontFamily: FONT,
        fontWeight: 500,
        lineHeight: "133.4%",
        fontSize: pxToRem(21),
      },
      main16: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      secondary16: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(24),
        fontSize: pxToRem(16),
      },
      main14: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: pxToRem(14),
      },
      secondary14: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.15),
        lineHeight: pxToRem(20),
        fontSize: "14px",
      },
      main12: {
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
      secondary12: {
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: pxToRem(0.1),
        lineHeight: pxToRem(16),
        fontSize: pxToRem(12),
      },
    },
  } as ThemeOptions;
};

export function getThemedComponents(theme: Theme) {
  return {
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            margin: "32px 0",
            paddingLeft: "16px",
            paddingRight: "16px",
            [theme.breakpoints.up("sm")]: {
              maxWidth: "100%",
              margin: "36px 0",
              paddingLeft: "40px",
              paddingRight: "40px",
            },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            transform: "unset",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.muted,
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            "& .MuiSlider-thumb": {
              color: "#a0f2c4",
            },
            "& .MuiSlider-track": {
              color: "#a0f2c4",
            },
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            "& .MuiPaginationItem-root": {
              "&.Mui-selected": {
                backgroundColor: "#476182",
                color: theme.palette.text.primary,
              },
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
          sizeLarge: {
            ...theme.typography.buttonL,
            padding: "10px 24px",
          },
          sizeMedium: {
            ...theme.typography.buttonM,
            padding: "8px 16px",
            height: "36px",
          },
          sizeSmall: {
            ...theme.typography.buttonS,
            padding: "0 6px",
          },
        },
        variants: [
          {
            props: { variant: "surface" },
            style: {
              color: theme.palette.common.white,
              backgroundColor: "#072a40",
              "&:hover, &.Mui-focusVisible": {
                backgroundColor: theme.palette.background.header,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "contained" },
            style: {
              color: theme.palette.primary.dark,
              boxSizing: "border-box",
              border: "1px solid transparent",
              fontSize: pxToRem(15),
              fontWeight: 600,
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.primary.main,
                border: "1px solid " + theme.palette.primary.main,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "gradient" },
            style: {
              color: theme.palette.primary.dark,
              background: theme.palette.gradients?.secondary,
              boxSizing: "border-box",
              border: "1px solid transparent",
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.splyceAccent,
                border: "1px solid " + theme.palette.other.splyceAccent,
              },
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { color: "primary", variant: "outlined" },
            style: {
              background: theme.palette.background.surface,
              borderColor: theme.palette.divider,
              "&:disabled": {
                color: theme.palette.action.disabled,
                background: "transparent",
                borderColor: theme.palette.action.disabled,
                cursor: "not-allowed",
                pointerEvents: "all",
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: theme.palette.primary.main,
              background: "transparent",
              border: "1px solid " + theme.palette.primary.main,
              "&:hover, &.Mui-focusVisible": {
                background: "transparent",
                color: theme.palette.other.splyceAccent,
                border: "1px solid " + theme.palette.other.splyceAccent,
              },
              "&:disabled": {
                color: theme.palette.primary.main,
                background: "transparent",
                borderColor: theme.palette.primary.main,
                cursor: "not-allowed",
                opacity: 0.5,
                pointerEvents: "all",
              },
            },
          },
        ],
      },
      MuiTypography: {
        defaultProps: {
          variant: "description",
          variantMapping: {
            display1: "h1",
            h1: "h1",
            h2: "h2",
            h3: "h3",
            h4: "h4",
            h5: "h5",
            h6: "h6",
            subheader1: "p",
            subheader2: "p",
            caption: "p",
            description: "p",
            buttonL: "p",
            buttonM: "p",
            buttonS: "p",
            main12: "p",
            main14: "p",
            main16: "p",
            main21: "p",
            secondary12: "p",
            secondary14: "p",
            secondary16: "p",
            secondary21: "p",
            helperText: "div",
            tooltip: "div",
          },
        },
      },
      MuiLink: {
        defaultProps: {
          variant: "description",
        },
      },
      MuiMenu: {
        defaultProps: {
          PaperProps: {
            elevation: 0,
            variant: "outlined",
            style: {
              minWidth: 240,
              marginTop: "4px",
            },
          },
        },
        styleOverrides: {
          paper: {
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: "#1F2632",
            borderRadius: "8px",
            boxShadow: "0px 4px 40px 0px rgba(0, 7, 21, 0.30)",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          padding: {
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "8px 16px",
            "&.Mui-selected": {
              backgroundColor: "#314156",
              "&:hover": {
                backgroundColor: "#314156",
              },
            },
            "&:hover": {
              backgroundColor: "#31415670",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            ...theme.typography.description,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.light,
            minWidth: "unset !important",
            marginRight: "12px",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            padding: "24px",
            [theme.breakpoints.down("sm")]: {
              padding: "24px 16px",
            },
          },
        },
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
            },
          },
          {
            props: { variant: "elevation" },
            style: {
              boxShadow:
                "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
              ...(theme.palette.mode === "dark"
                ? { backgroundImage: "none" }
                : {}),
            },
          },
        ],
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#fff",
            color: "#000c24",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
            ...theme.typography.tooltip,
          },
          arrow: {
            color: theme.palette.background.paper,
            "&:before": {
              boxShadow:
                "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: theme.palette.text.secondary,
            "&.Mui-checked": {
              color: theme.palette.text.primary,
            },
            "&.Mui-disabled": {
              color: theme.palette.action.disabled,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: theme.palette.primary.main,
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.5,
              },
            },
            "&.Mui-disabled": {
              opacity: theme.palette.mode === "dark" ? 0.3 : 0.7,
            },
          },
        },
      },
      MuiIcon: {
        variants: [
          {
            props: { fontSize: "large" },
            style: {
              fontSize: pxToRem(32),
            },
          },
        ],
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            ...theme.typography.caption,
            boxShadow: "none",
            alignItems: "flex-start",
            "&.MuiAlert-root": {
              padding: "4px 16px",
              marginTop: "12px",
              marginBottom: "12px",
            },
          },
        },
        defaultProps: {
          iconMapping: {
            error: (
              <SvgIcon color="inherit">
                <ErrorOutlineOutlinedIcon />
              </SvgIcon>
            ),
            info: (
              <SvgIcon color="inherit">
                <InfoOutlinedIcon />
              </SvgIcon>
            ),
            success: (
              <SvgIcon color="inherit">
                <CheckCircleOutlineOutlinedIcon />
              </SvgIcon>
            ),
            warning: (
              <SvgIcon color="inherit">
                <ErrorOutlineOutlinedIcon />
              </SvgIcon>
            ),
          },
        },
        variants: [
          {
            props: { severity: "error" },
            style: {
              color: theme.palette.error["100"],
              background: theme.palette.error["200"],
              border: `1px solid ${theme.palette.error["300"]}`,
              a: {
                color: theme.palette.error["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.error["100"],
              },
            },
          },
          {
            props: { severity: "info" },
            style: {
              color: theme.palette.info["100"],
              background: theme.palette.info["200"],
              border: `1px solid ${theme.palette.divider}`,
              a: {
                color: theme.palette.info["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.info["100"],
              },
            },
          },
          {
            props: { severity: "success" },
            style: {
              color: theme.palette.success["100"],
              background: theme.palette.success["200"],
              a: {
                color: theme.palette.success["100"],
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.success["100"],
              },
            },
          },
          {
            props: { severity: "warning" },
            style: {
              color: theme.palette.warning["100"],
              background: theme.palette.warning["200"],
              border: "1px solid" + theme.palette.warning["300"],
              a: {
                textDecoration: "none",
                color: theme.palette.other.splyceLink,
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              ".MuiButton-text": {
                padding: 0,
                color: theme.palette.warning["100"],
              },
            },
          },
        ],
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: pxToRem(14),
            lineHeight: 1.5,
            minWidth: "375px",
            color: "#fff",
            background: "#1F2632",
            "> div:first-of-type": {
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#000E16",
            color: theme.palette.text.primary,
            borderBottom: `1px solid #314156`,
            borderRadius: 0,
            padding: 0,
            [theme.breakpoints.down("sm")]: {
              padding: 0,
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            minHeight: "64px",
            height: "64px",
            boxSizing: "border-box",
            [theme.breakpoints.up("sm")]: {
              paddingLeft: "40px",
              paddingRight: "40px",
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          colorPrimary: {
            color: theme.palette.primary.light,
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: (props) => (
            <KeyboardArrowDownRoundedIcon
              sx={{ fontSize: "22px", color: "#9EBBC1" }}
              {...props}
            />
          ),
        },
        styleOverrides: {
          root: {
            "&.Mui-focused, &:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #a0adb2",
                boxShadow: theme.palette.action.focus,
              },
            },
            "&.Mui-disabled:hover": {
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#EBEBEF4D",
                boxShadow: "none",
              },
            },
          },
          outlined: {
            backgroundColor: theme.palette.background.surface,
            ...theme.typography.buttonM,
            padding: "6px 12px",
            color: theme.palette.primary.light,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar1Indeterminate: {
            background: theme.palette.gradients?.primary,
          },
          bar2Indeterminate: {
            background: theme.palette.gradients?.primary,
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              padding: 0,
            },
            [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
              "&.LendingModal": {
                "&>.MuiPaper-root": {
                  position: "relative",
                  height: "100dvh",
                  width: "100%",
                  maxHeight: "unset",
                  maxWidth: "unset",
                  borderRadius: "0",
                  margin: "0",
                },
              },
              ".TxActionsWrapper": {
                position: "absolute",
                bottom: 50,
                left: 20,
                right: 20,
              },
            },
          },
        },
      },
    },
  } as ThemeOptions;
}
