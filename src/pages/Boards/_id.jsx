import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '654344dbdbbdd47dd3b04cdc'
    // Call Api
    fetchBoardDetailsAPI(boardId)
      .then(board => { // board này là lấy từ Api về

        // Xử lý vấn đề kéo thả card vào 1 column rỗng ( lấy về cả 1 board và check, khi F5 trang web )
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={ board } />  
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board

