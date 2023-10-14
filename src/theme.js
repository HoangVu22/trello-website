// import { createTheme } from '@mui/material/styles'
// import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },

  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: deepOrange,
    //   },
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange,
    //   },
    // },
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
            backgroundColor: '#dcdde1',
            borderRadius: '6px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
            borderRadius: '6px',
          },
        },
      },
    },
    MuiButton: {   // custom Button
      styleOverrides: {
        root: {
          textTransform: 'none', // tất cả thẻ button về chữ thường
          borderWidth: '0.5px',   
          '&:hover': {
            borderWidth: '1px'
          }
        },
      },
    },
    MuiInputLabel: {   // custom input label
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        }
      },
    },
    MuiOutlinedInput: {  // custom outline input
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' }, // cho cái outline bớt đậm
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        } 
      },
    },
  },
})

export default theme