import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCardIcon from '@mui/icons-material/AddCard'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import Column from './Columns/Column'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
// horizontalListSortingStrategy: nó sẽ tối ưu cho việc kéo ngang
// verticalListSortingStrategy: nó sẽ tối ưu cho việc kéo dọc

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  // nếu createNewColumn là false thì khi chạy qua toggleCreateNewColumn sẽ chuyển thành true và ngược lại
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }
    // console.log(newColumnTitle)
    // Gọi API

    // Đóng trạng thái thêm Column và clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  /*
    - Thằng SortableContext yêu cầu items là 1 mảng dạng ['id-1', 'id-2',...]
      chứ không phải là [{id: 'id-1'}, {id: 'id-2'}]
    -Nếu không đúng thì vẫn kéo thả được nhưng không có animation 
    - Đọc thêm: https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
    - Nên map dữ liệu ra để lấy id bỏ vào, đừng có để object luôn
    => items={columns?.map(col => col._id)} lấy ra 1 mảng chứa toàn bộ id của column, còn column đã sắp xếp bên BoardContent rồi.
  */
  return (
    <SortableContext items={columns?.map(col => col._id)} strategy={horizontalListSortingStrategy}> 
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
        {!openNewColumnForm
          ? <Box
            onClick={toggleOpenNewColumnForm}
            sx={{ 
              minWidth: '250px',
              maxWidth: '250px',
              bgcolor: '#ffffff3d',
              mx: 2,
              borderRadius: '10px',
              height: 'fit-content', // ăn theo nội dung bên trong
            }}>
            <Button
              startIcon={<AddCardIcon />}
              sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 3, py: 1.5 }}
            >
              Add another column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '10px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='primary' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.primary.main,
                  // '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer' }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
