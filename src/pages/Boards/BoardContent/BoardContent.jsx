import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'

import {
  DndContext,  // DndContext là vùng để kéo thả //PointerSensor
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay, // làm cái bóng giữ chỗ, khi kéo column hay card nó vẫn sẽ còn cái bóng đang kéo ở vị trí đó
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

// Để biết được là đang kéo column hay kéo card
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_CARD',
}

function BoardContent({ board }) {
  // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  // đưa dl orderedColumns ra dạng state để chúng ta cập nhật lại và nó sẽ ăn lại state và render lại cpn
  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ được 1 phần tử được kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id) // có được phần tử đang kéo có id là gì
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN) // nếu nó tồn tại columnId thì kiểu của cái item đang kéo là CARD, không thì là COLUMN
    setActiveDragItemData(event?.active?.data?.current) // kéo cái gì nó sẽ là cái đó, kéo column thì data của nó là column, kéo card là card
  }

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

    // sau khi thả ra thì sẽ set tất cả về null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  // Animation khi thả phần tử
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    }),
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
    <DndContext
      onDragEnd={handleDragEnd} // prop onDragEnd: sau khi kéo và thả đi
      onDragStart={handleDragStart} // khi bắt đầu kéo 1 phần tử
      sensors={sensors}
    >
      <Box sx={{
        bgcolor: (theme) => (
          theme.palette.mode === 'dark' ? '#34495e' : '#009688'
        ),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>

        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {/* Nếu như không tồn tại type thì không có gì cả (không kéo thả gì cả) */}
          {!activeDragItemType && null}
          {/* Nếu như có tồn tại type mà nó bằng column thì gọi cpm Column để giữ chỗ và có giá trị dữ liệu column đẩy xuống là activeDragItemData */}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {/* Nếu như có tồn tại type mà nó bằng card thì gọi cpm Card để giữ chỗ và có giá trị dữ liệu card đẩy xuống là activeDragItemData */}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>

      </Box>
    </DndContext>
  )
}

export default BoardContent
