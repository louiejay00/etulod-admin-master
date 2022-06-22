import { Typography,Button } from "@material-ui/core";
import axios from "axios";
export default function IndexPage() {

  const handleBackup = () =>{   
    console.log("clicked");  
    axios
    .get("/admin/databasebackup", {
    })
    .then((res) => {
      console.log("res", res);
      console.log("res", res.data);
    })
    .catch((err) => {
      console.error("error in log Creation", err);
    })

  };  

const handleRestore = () =>{
  console.log("handleRestore clicke");
  axios
  .get("/admin/databaserestore", {
  })
  .then((res) => {
    console.log("res", res);
    console.log("res", res.data);
  })
  .catch((err) => {
    console.error("error in log Creation", err);
  })
}

   
  return (
    <>    
         <Button
      onClick= {handleBackup}
          variant="contained"  
          style={{
            left: "75%",
            borderRadius: 15,
            backgroundColor: "#fff",
            marginRight:"10px",
            zIndex:100
          }}
        >
          <Typography
            className="butt"
            style={{
              fontWeight: 400,
            }}
            variant="body1"
          >
           DB Backup
          </Typography>
        </Button>
        <Button
      onClick= {handleRestore}
          variant="contained"
          style={{
            left: "75%",
            borderRadius: 15,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            className="butt"
            style={{
              fontWeight: 400,
            }}
            variant="body1"
          >
            Restore Backup
          </Typography>
        </Button>
      <Typography paragraph>
        E-tulod ride hailing application that is convinient for people who don't have go
        to the toda station or wait for other passengers.  E-Tulod will be a mobile application 
        that will notify tricycle drivers within Bayombong that there is a passenger
        available for pick up (after a passenger inputs the details in the app)
        and they will have the option to pick up the passenger after the request is 
        accepted the passenger will be notified that there is a tricycle on the way.  
       
      </Typography>
      <Typography paragraph>
        This project is a different take on other ride hailing mobile applications 
        because instead of using private vehicles or cars the mobile application utilizes 
        tricycles which is very common for transportation in Bayombong. Also, the mobile 
        application uses SMS text message for notifications and transfer of information 
        from passenger to Tricycle driver.  
      </Typography>
    </>
  );
}
