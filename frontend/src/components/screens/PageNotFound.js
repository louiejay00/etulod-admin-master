import { Box, Divider, Typography } from "@material-ui/core";
import pageNotFoundImage from "../../assets/pageNotFound.svg";

export default function PageNotFound() {
  return (
    <div
      style={{
        height: "80vh",
        textAlign: "center",
      }}
    >
      <img
        style={{
          width: 720,
        }}
        src={pageNotFoundImage}
        alt="Page not Found"
      />
      <Box>
        <Typography
          style={{
            marginTop: 16,
          }}
          noWrap
        >
          Oops... Page not Found
        </Typography>
      </Box>
    </div>
  );
}
