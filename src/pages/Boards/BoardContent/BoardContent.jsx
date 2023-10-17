import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'

import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core' // DndContext là vùng để kéo thả //PointerSensor
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  // đưa dl orderedColumns ra dạng state để chúng ta cập nhật lại và nó sẽ ăn lại state và render lại cpn
  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tai over (kéo linh tinh ra ngoài thì return luôn để tránh lỗi)
    if (!over) return

    if (active.id !== over.id) {
      // tìm vị trí của từng thằng
      // lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex(col => col._id === active.id)
      // lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex(col => col._id === over.id)

      // dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
      // Code của nó ở đây: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)

      // const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)

      // Cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
  }

  // ngăn chặn khi click vào columns nó chạy hàm handleDragEnd, phải move 10 pixels thì nó mới chạy

  // Nếu dùng PointerSensor mặc định thì phải kết hợp với thuộc tính CSS touch-action: none (Column.jsx) ở những phần từ kéo th
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })  // yêu cầu con chuột move 10 pixels
  // const sensors = useSensors(pointerSensor)
  
  // Ưu tiên sủ dụng 2 loại sensor là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })  // yêu cầu con chuột move 10 pixels 
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } }) // nhấn giữ 250ms và dung sai(tolerance) của cảm ứng (có nghĩa là di chuyển/chênh lệch 500px thì mới kích hoạt event)
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    // prop onDragEnd: sau khi kéo và thả đi
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (
          theme.palette.mode === 'dark' ? '#34495e' : '#009688'
        ),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>

        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
