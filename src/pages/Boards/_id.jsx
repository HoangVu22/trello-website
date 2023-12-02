import { useEffect, useState } from 'react'
import { Container, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI, 
  createNewColumnAPI, 
  createNewCardAPI, 
  updateBoardDetailsAPI, 
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '654344dbdbbdd47dd3b04cdc'
    // Call Api
    fetchBoardDetailsAPI(boardId)
      .then(board => { // board này là lấy từ Api về
        // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dl xuống các cpn con
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

        board.columns.forEach(column => {
          // Xử lý vấn đề kéo thả card vào 1 column rỗng ( lấy về cả 1 board và check, khi F5 trang web )
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {  // trường hợp k phải là column rỗng thì phải sắp xếp card
            // Sắp xếp thứ tự các card luôn ở đây trước khi đưa dl xuống các cpn con
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        
        setBoard(board)
      })
  }, [])

  // Gọi API tạo mới 1 column và cập nhật lại dl state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData, // là title bên ListColumn
      boardId: board._id
    })
    // console.log('createdColumn: ', createdColumn)

    // Xử lý vấn đề kéo thả card vào 1 column rỗng ( khi tạo mới 1 column )
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Câp nhật lại state board để khi tạo xong column thì đổ trực tiếp ra UI
    const newBoard = { ...board } // clone cái board ra
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Gọi API tạo mới 1 card và cập nhật lại dl state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Câp nhật lại state board để khi tạo xong card thì đổ trực tiếp ra UI
    const newBoard = { ...board } // clone cái board ra
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId) // Tìm column trong mảng board làm sao ra cái column là cái thằng chứa card mới tạo
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Gọi API và xử lý kéo thả Column xong
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dl state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
    const newBoard = { ...board } // clone cái board ra
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // Gọi API và xử lý kéo thả Card trong cùng 1 Column xong
  const moveColumnsInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dl state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId) // Tìm column trong mảng board làm sao ra cái column là cái thằng chứa card mới tạo
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Gọi API và xử lý kéo thả Card đến 1 Column khác xong
  /* 
    - B1: Cập nhật lại mảng cardOrderIds của Column ban đầu chứa nó (Xóa đi cái _id của Card ra khỏi mảng)
    - B2: Cập nhật lại mảng cardOrderIds của Column tiếp theo (Thêm _id của Card vào mảng)
    - B3: Cập nhật lại trường columnId mới của Card đã kéo 
    => Viết 1 Api support riêng
  */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dl state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)
    const newBoard = { ...board } // clone cái board ra
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Column khi kéo thả card đến Column khác
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(col => col._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId)?.cardOrderIds,
    })
  }

  // Loading khi k có Board
  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography variant='h6'>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={ board } />  
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveColumnsInTheSameColumn={moveColumnsInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board

