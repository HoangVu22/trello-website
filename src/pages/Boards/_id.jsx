import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '654344dbdbbdd47dd3b04cdc'
    // Call Api
    fetchBoardDetailsAPI(boardId)
      .then(board => { // board này là lấy từ Api về
        setBoard(board)
      })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={ board } />  
      <BoardContent board={ board } />
    </Container>
  )
}

export default Board

