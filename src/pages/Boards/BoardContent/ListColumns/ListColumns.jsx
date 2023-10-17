import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCardIcon from '@mui/icons-material/AddCard'
import Column from './Columns/Column'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
// horizontalListSortingStrategy: nó sẽ tối ưu cho việc kéo ngang
// verticalListSortingStrategy: nó sẽ tối ưu cho việc kéo dọc

function ListColumns({ columns }) {
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
    </SortableContext>
  )
}

export default ListColumns
