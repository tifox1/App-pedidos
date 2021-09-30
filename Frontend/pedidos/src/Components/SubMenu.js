import { AppBar, Box, Breadcrumbs, Fab, Grid, Typography, useTheme } from '@material-ui/core'
import { Link } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'

const SubMenu = ({buttons, breadCrumbs, children}) => {
    const theme = useTheme()
    console.log(children)
    return (<>
        <AppBar
            position="sticky" elevation={0}
            style={{
                background: theme.palette.background.default,
            }}
        >
            <Box padding={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Breadcrumbs>
                            {breadCrumbs.map(breadCrumb => {
                                if (breadCrumb === breadCrumbs.at(-1)) {
                                    return (
                                        <Typography color="textPrimary">{
                                            breadCrumb[0]
                                        }</Typography>
                                    )
                                }
                                return (
                                    <Typography
                                        color="inherit"
                                        style={{display: 'flex'}}
                                        component={Link}
                                        to={breadCrumb[1]}
                                    >
                                        {breadCrumb[0]}
                                    </Typography>)
                            })}
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12}>
                        {buttons && buttons.map(button => {
                            return (
                                <Fab
                                    size="small"
                                    variant="extended"
                                    color="primary"
                                    onClick={button[2]}
                                >
                                    {button[0]} {button[1]}
                                </Fab>
                            )
                        })}
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </AppBar>
    </>)
}

export default SubMenu