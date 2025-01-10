import { Box,TextField,Button } from "@mui/material";
const homePage = ()=>{

  // return<>
  // <h1>Home Page</h1>
  // <Box >
  // <TextField id="email" label="Email" variant="outlined" />
  // <TextField id="password" label="Password" variant="outlined" />
  // <Button variant="contained">login</Button>
  // </Box>
  // </> 


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh" // Full height of the viewport
    >
      <h1>Home Page</h1>
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        margin="normal" 
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        margin="normal"
        type="password" 
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );


}
export default homePage