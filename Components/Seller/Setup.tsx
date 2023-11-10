import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import Container from "@mui/material/Container";
import Packages from "./Packages";
import GenNav from "../Layouts/GenNav";

const SetupPage: React.JSXElementConstructor<any> = () => {
  // type stepper = {
  //     stepper : {
  //         step: number
  //     }
  // }
  // const stepper = useSelector((state: stepper)=> state.stepper.step);

  return (
    <>
      <GenNav admin={false} mode={true} />
      <Container component={"main"} maxWidth={"lg"}>
        <>
          <CssBaseline />
          {/*stepper allows us to keep track of the current stage in when setting up the seller's store*/}
          <Packages />
          {/*{stepper === 2 && <StoreInfo/>}*/}
        </>
      </Container>
    </>
  );
};
export default SetupPage;
