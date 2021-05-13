import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { LinearLoader } from '../common/Loaders';


export const TransferNFT = ({ handleClose, handleConfirm, transferring, handleChange, selected, open, error }) => {

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Transfer Token(s) <b>: [{selected.toString()}]</b></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the Etherium address to transfer the NFT(s) to
                    </DialogContentText>
                    <TextField
                        onChange={handleChange}
                        autoFocus
                        margin="dense"
                        id="address"
                        required
                        label="Etherium Address"
                        fullWidth
                        disabled={transferring}
                        helperText={!!error ? error : ""}
                        error={!!error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={transferring} onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!!error || transferring} onClick={handleConfirm} color="primary">
                        Transfer
                    </Button>
                </DialogActions>
                {transferring &&
                    <DialogActions>
                        <div style={{ width: "100%" }}>
                            Transferring NFT...
                    <LinearLoader />
                        </div>
                    </DialogActions>}
            </Dialog>
        </div>
    );
}
