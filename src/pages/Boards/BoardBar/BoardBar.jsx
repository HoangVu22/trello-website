import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewArrayIcon from '@mui/icons-material/ViewArray'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '6px',
  '.MuiSvgIcon-root': { // custom icon
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
}

function BoardBar() {
  return (
    <Box px={2} sx={{
      bgcolor: (theme) => (
        theme.palette.mode === 'dark' ? '#34495e' : '#26a69a'
      ),
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      borderBottom: '1px solid white',
      overflowX: 'auto',
      '&::-webkit-scrollbar-track': { m: 2 },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={ MENU_STYLES }
          icon={<DashboardIcon />}
          // clickable là để click vào  cái label đó
          label="Hoang Vu" clickable />
        <Chip
          sx={ MENU_STYLES }
          icon={<ViewArrayIcon />}
          label="My Trello Website" clickable />
        <Chip
          sx={ MENU_STYLES }
          icon={<VpnLockIcon />}
          label="Public/Private Workspace" clickable />
        <Chip
          sx={ MENU_STYLES }
          icon={<AddToDriveIcon />}
          label="Add To Google Drive" clickable />
        <Chip
          sx={ MENU_STYLES }
          icon={<FilterListIcon />}
          label="Filters" clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={6}
          sx={{ 
            gap: '4px',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: '15px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://avatars.githubusercontent.com/u/90297995?v=4" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV16mPnpmTbQFR0dtsn0I7kWBO3KFEjs87-4RtMrzxUoy_EDKqjoP72CwPCcDj9xNZfp0&usqp=CAU" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://3.bp.blogspot.com/-s-H8uY0hn-A/T4OMbKPQOmI/AAAAAAAABnY/II7mv2dOITI/s1600/thien-nhien-14-non-nuoc-may-troi-namkna-blogspot-com.jpg" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_e2JagBLnVYGfQNm2AZjuGmM9IiB1b7vu9m7WUfUesuxHr35hIrnKOhFnixYh9VIsqJQ&usqp=CAU" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://icdn.dantri.com.vn/k:a6f7e4a5db/2016/01/09/natural-1-1452281304567/bo-suu-tap-hinh-nen-phong-canh-tuyet-dep-danh-cho-nguoi-yeu-thien-nhien.jpg" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://avatars.githubusercontent.com/u/90297995?v=4" />
          </Tooltip>
          <Tooltip title='Hoang Vu'>
            <Avatar alt="Hoang Vu" src="https://avatars.githubusercontent.com/u/90297995?v=4" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar

