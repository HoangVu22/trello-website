import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCardIcon from '@mui/icons-material/AddCard'
import Column from './Columns/Column'

function ListColumns({ columns }) {
  return (
    <Box
      sx={{ 
        bgcolor: 'inherit', // kế thừa bg của thằng cha, thằng ngoài cùng
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 },
      }}
    >

      {columns?.map((column) => {
        return <Column key={column?._id} column={column} />
      })}

      {/* Box Add new column */}
      <Box
        sx={{ 
          minWidth: '200px',
          maxWidth: '200px',
          bgcolor: '#ffffff3d',
          mx: 2,
          borderRadius: '10px',
          height: 'fit-content', // ăn theo nội dung bên trong
        }}
      >
        <Button
          startIcon={<AddCardIcon />}
          sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 3, py: 1.5 }}
        >
          Add another column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
