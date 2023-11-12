import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

export default function MaxWidthDialog() {
    const [open, setOpen] = React.useState(false);



    return (
        <React.Fragment>
            <Button variant="outlined"  >
                Open max-width dialog
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth={"xl"}
                open={true}
            >
                dsf
            </Dialog>
        </React.Fragment>
    );
}
