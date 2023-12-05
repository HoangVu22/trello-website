import { useState } from 'react'
import { toast } from 'react-toastify'
import ListCards from './ListCards/ListCards'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useConfirm } from 'material-ui-confirm'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, createNewCard, deleteColumn }) {
  // kéo thả
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column } // bổ sung dl sau khi kéo thả
  })
  const dndKitColumnStyles = {
    // touchAction: 'none', // dành cho sensor default dạng pointersensor (trên điện thoại)
    
    // thay CSS.Transform bằng CSS.Translate thì cột sẽ k bị biến đổi khi kéo
    // Đọc thêm: https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    /*
      - Chiều cao phải luôn mã 100% vì nếu không nó sẽ lỗi(bị dựt) lúc kéo 1 column ngắn quá và 1 column thì dài quá
        thì phải kéo ở khu vực giữa giữa rất khó chịu.
      - Lưu ý phải kết hợp với {...listeners} nằm ở Box chứ không phải nằm ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh.
    */
    height: '100%',
    // isDragging: có nghĩa là khi đang kéo sẽ có bóng mờ
    opacity: isDragging ? 0.5 : undefined,
  }

  //  dropdown menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Card đã được sắp xếp ở cpn cha
  const orderedCards = column.cards

  // Form tạo card mới
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  // nếu createNewCard là false thì khi chạy qua toggleCreateNewCard sẽ chuyển thành true và ngược lại
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter card title')
      return
    }
    
    // Tạo dl card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Gọi lên props function createNewCard nằm ở component cha cao nhất (board/_id.jsx)
    await createNewCard(newCardData)

    // Đóng trạng thái thêm Card và clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Xử lý xóa 1 Column và Card
  const confirmDeleteColumn = useConfirm()

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      
      // dialogProps: { maxWidth: 'lg' }
      // allowClose: false,
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationButtonProps: { color: 'error', variant: 'outlined' }
    })
      .then(() => {
        // Gọi lên props func deleteColumn nằm ở cpn cha
        deleteColumn(column._id)
      })
      .catch(() => {})
  }

  return (
    // Phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ bị lỗi kiểu flickering.
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <Box
        {...listeners}

        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'
          ),
          ml: 2,
          borderRadius: '10px',
          height: 'fit-content', //ăn theo nội dung bên trong
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Header */}
        <Box 
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            {column?.title}
          </Typography>

          <Box>
            <Tooltip title='More option'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-card-icon': { color: 'primary.main' }
                  }
                }}>
                <ListItemIcon>
                  <AddCardIcon fontSize="small" className='add-card-icon' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'error.main',
                    '& .delete-forever-icon': { color: 'error.main' }
                  }
                }}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" className='delete-forever-icon' />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List Cards */}
        <ListCards cards={orderedCards} />

        {/* Footer Box Add new card*/}
        <Box 
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button onClick={toggleOpenNewCardForm} startIcon={<AddCardIcon />} >Add a card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained' color='primary' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.primary.main,
                    // '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
