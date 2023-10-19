import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

import {
  DndContext,  // DndContext là vùng để kéo thả //PointerSensor
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay, // làm cái bóng giữ chỗ, khi kéo column hay card nó vẫn sẽ còn cái bóng đang kéo ở vị trí đó
  defaultDropAnimationSideEffects,
  closestCorners,
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

  const findColumnByCardId = (cardId) => {
    // đi vào mảng column và tìm cái column mà nó chứa mảng cards (xem ở file Mock.js)
    // sau đó map mảng cards này để lấy cái mảng mới chứa toàn bộ id của cards
    // rồi cái mảng id này thì kiểm tra xem mảng đó có chứa cardId không. Nếu chứa thì return luôn, còn không thì underfined
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id) // có được phần tử đang kéo có id là gì
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN) // nếu nó tồn tại columnId thì kiểu của cái item đang kéo là CARD, không thì là COLUMN
    setActiveDragItemData(event?.active?.data?.current) // kéo cái gì nó sẽ là cái đó, kéo column thì data của nó là column, kéo card là card
  }

  const handleDragOver = (event) => {
    // console.log('handleDragOver: ', event)

    // không làm gì thêm nếu như đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Xử lý lúc kéo Card qua lại giữa các column
    const { active, over } = event
    if (!active || !over) return

    // activeDraggingCard là Card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là Card đang tương tác ở trên hoặc dưới so với Card đang được kéo
    const { id: overCardId } = over

    // Tìm 2 Column theo CardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu 1 trong 2 k có thì k làm gì hết để tránh lỗi
    if (!activeColumn || !overColumn) return

    // Kiểm tra nếu kéo card ở 2 Column khác nhau thì mới cho code vào đây
    // Còn nếu kéo card trong chính column ban đầu của nó thì k làm gì
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí index của overCard trong Column (là nơi activeDraggingCard sắp được thả)
        const overCardIndex = overColumn.cards.findIndex(card => card._id === overCardId)

        // Logic tính toán lại 1 index mới cho card mà chúng ta sắp kéo sang, lấy code từ thư viện dnd-kit trong github
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1

        // clone mảng orderedColumns cũ ra 1 cái mới để xử lý data rồi return và cập nhật lại orderedColumns mới
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        
        if (nextActiveColumn) {
          // xóa card ở column active (column cũ) là cái mà chúng ta kéo card ra khỏi column để sang column khác
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          // kiểm tra xem card đang kéo nó có tồn tại ở overColumn hay chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Thêm card đang kéo vào overColumn theo vị trí index mới
          // splice là nó modify trực tiếp vào cái mảng mà nó đang gọi
          // toSpliced là nó trả về 1 mảng mới, không đụng chạm gì đến mảng cũ
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Hành động kéo thả Card - tạm thời không làm gì cả')
    }

    const { active, over } = event

    // Kiểm tra nếu không tồn tai active hoặc over (kéo linh tinh ra ngoài thì return luôn để tránh lỗi)
    if (!active || !over) return

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
      onDragStart={handleDragStart} // khi bắt đầu kéo 1 phần tử
      onDragOver={handleDragOver}  // trigger trong quá trình kéo (drag) 1 phần tử
      onDragEnd={handleDragEnd} // prop onDragEnd: sau khi kéo và thả đi
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu k có nó thì card với cover lớn sẽ k kéo qua column khác được)
      // vì lúc này nó đang bị conflict giữa card và column
      collisionDetection={closestCorners}
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
