import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ItemCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/images/banana.png"
          alt="Item Photo"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Banana
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
