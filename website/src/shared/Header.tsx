import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material';

export const Header = () => {
  const base = process.env.PUBLIC_URL || '';
  const home = base + '/#/';
  return (
    <AppBar position="static" color="dark" sx={{ marginBottom: 4, boxShadow: 0 }} >
      <Toolbar style={{justifyContent: "center"}}>
        <Link href={home} color="inherit" underline="none">
          <Typography variant="h6" component="div">
            <Box
              sx={{
                verticalAlign: 'middle',
                paddingY: '24px',
                height: '50px',
              }}
              component="img"
              height="50"
              alt="Adeliom"
              src="logo.svg"
            />
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
