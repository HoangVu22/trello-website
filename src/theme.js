// import { createTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },

  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
      },
    },
  },

  components: {

    MuiCssBaseline: {   // custom scroll bar cho tất cả các trình duyệt
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '6px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00b894',
            borderRadius: '6px',
          },
        },
      },
    },
    MuiButton: {   // custom Button
      styleOverrides: {
        root: {
          textTransform: 'none', // tất cả thẻ button về chữ thường
        },
      },
    },
    MuiInputLabel: {   // custom input label
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
          }
        }
      },
    },
    MuiOutlinedInput: {  // custom outline input
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
            '.MuiOutlinedInput-notchedOutline': {  // custom outline
              borderColor: theme.palette.primary.light
            },
            '&:hover': {
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main
              },
            },
            '& fieldset': {
              borderWidth: '1px !important',  // cho cái outline bớt đậm
            }
          } 
        }
      },
    },
  },
})

export default theme