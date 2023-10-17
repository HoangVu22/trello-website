import Box from '@mui/material/Box'
import Card from './Card/Card'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
// verticalListSortingStrategy: nó sẽ tối ưu cho việc kéo dọc

function ListCards({ cards }) {
  return (
    <SortableContext items={cards?.map(col => col._id)} strategy={verticalListSortingStrategy}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: '0 5px',
          m: '0 5px',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnHeaderHeight} - ${theme.trello.columnFooterHeight})`,
          overflowX: 'hidden',
          overflowY: 'auto',
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da',
            borderRadius: '6px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf',
            borderRadius: '6px',
          },
        }}
      >
        {cards?.map((card) => {
          return <Card key={card?._id} card={card} />
        })}

      </Box>
    </SortableContext>
  )
}

export default ListCards
