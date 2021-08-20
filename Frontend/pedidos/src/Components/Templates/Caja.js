import { Box, Grid, Paper, Typography, Zoom } from '@material-ui/core'
import React from 'react'

const Caja = (props) => {
    return(<>
        <Grid item
              xs={12} component={Box} padding={1}>
            <Zoom in={true}>
                <Paper variant="outlined">
                    <Grid container spacing={1} component={Box} padding={2}>
                        <Grid container xs={12} direction="row" alignItems="center">
                            {(() => {
                                if (props.title) {
                                    return(<>
                                        <Typography variant="h6">{
                                            props.title
                                        }</Typography>
                                    </>)
                                }
                            })()}
                        </Grid>
                        <Grid item xs={12}>
                            {props.children}
                        </Grid>
                    </Grid>
                </Paper>
            </Zoom>
        </Grid>
    </>)
}

export default Caja
