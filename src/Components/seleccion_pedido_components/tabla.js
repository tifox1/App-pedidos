
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MaterialTable from 'material-table';

const columnas = [
    {
        title: 'Cantidad',
        field: 'cantidad'
    },
    {
        title: 'Descripcion',
        field: 'descripcion'
    }
]
const data = [
    { cantidad: '4', descripcion: 'b' },
    { cantidad: '1', descripcion: 'a' }
]

const Tabla = () => {
    return (
        <Box m={2}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justify="center"
            >
                <Grid item xs={12} md={6} sm={12} padding={2}>

                    <MaterialTable
                        columns={columnas}
                        data={data}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Eliminar producto',
                                onClick: (event) => {
                                    console.log(event)
                                },
                            }
                        ]} />

                </Grid>
            </Grid>
        </Box>
    )
}
export default Tabla;
