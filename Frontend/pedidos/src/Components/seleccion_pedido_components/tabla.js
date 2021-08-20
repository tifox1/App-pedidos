import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table';
import { LinearProgress } from '@material-ui/core';

const columnas = [
    {
        title: 'Cantidad',
        field: 'cantidad'
    },
    {
        title: 'Producto',
        field: 'producto',
    },
    {
        title: 'Tarifa',
        field: 'tarifa'
    }
]
// const data = [
//     { cantidad: '4', producto: 'b' , fecha:''},
// ]

const Tabla = (props) => {
    const [datos, setDatos] = useState()
    const [elemento, setElemento] = useState()
    // useEffect(() => {
    //     fetch('/api/pedidos_list' ,{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json;',
    //         },
    //         body: JSON.stringify({
    //             usuario: 'Jorge',
    //             usuario_id: '2'
    //         })
    //     }).then(
    //         response => {return response.json()}
    //     ).then(
    //         data => {
    //             setDatos(data.resultado)
    //         }
    //     )
    //     const [elemento, setElemento]= useState()
    // }, []);

    return (
        <Box m={2}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justify="center"
            >
                <Grid item xs={12} md={10} sm={12} padding={2}>

                    <MaterialTable
                        columns={columnas}
                        data={props.resultado}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Eliminar producto',
                                onClick: (event, rowData) => {
                                    if (props.resultado.length === 0) {
                                        props.setValido(false)
                                    }
                                    console.log(rowData.tableData.id)
                                    props.setResultado(props.resultado.splice(rowData.tableData.id, 1))
                                    console.log(props.resultado)

                                },
                            }
                        ]} />

                </Grid>
            </Grid>
        </Box>
    )
}
export default Tabla;
