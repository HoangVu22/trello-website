import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (
        theme.palette.mode === 'dark' ? '#34495e' : '#fed9b7'
      ),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent
