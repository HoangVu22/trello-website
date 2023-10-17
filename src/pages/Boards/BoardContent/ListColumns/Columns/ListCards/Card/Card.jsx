import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material' // do bị trùng tên với func nên custom kiểu này
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ card }) {
  // kéo thả
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card } // bổ sung dl sau khi kéo thả
  })
  const dndKitCardStyles = {
    // touchAction: 'none', // dành cho sensor default dạng pointersensor (trên điện thoại)
    
    // thay CSS.Transform bằng CSS.Translate thì cột sẽ k bị biến đổi khi kéo
    // Đọc thêm: https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // isDragging: có nghĩa là khi đang kéo sẽ có bóng mờ
    opacity: isDragging ? 0.5 : undefined,
  }

  // -------------
  const shouldShowCardAction = () => {
    // 1 trong 3 thằng tồn tại thì nó sẽ là true và CardAction sẽ show lên
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}

      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        borderRadius: '8px'
      }}>
      
      {/* khi nó có card.cover thì mới có CardMedia */}
      {card?.cover && 
        <CardMedia
          sx={{ height: 140, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
          image={card?.cover}
        />
      }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldShowCardAction() && 
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {/* !!: nếu mảng memberIds.length có giá trị mà muốn lấy giá trị true/false thì
              - nếu 1 dấu ! thì nó sẽ phủ định thằng .length Vd: [].length => 0 (false), but ![].length => true
              - nếu 2 dấu !! thì nó sẽ phủ định của cái phủ định trước Vd: ![].length => true but !![].length => false
          */}
          {!!card?.memberIds?.length && 
            <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
          }
          {!!card?.comments?.length && 
            <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          }
          {!!card?.attachments?.length && 
            <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          }
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card
